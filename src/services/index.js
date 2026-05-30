import { supabase } from '../supabase/client';
import { useAuthStore } from '../store';

export const authService = {
  async register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuthStore.getState().logout();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export const orderService = {
  async submitOrder(orderData) {
    // Supabase order submission
    const { data, error } = await supabase.from('orders').insert([orderData]).select();
    if (error) throw error;

    // Google Apps Script webhook (connect later)
    // await axios.post(GOOGLE_APPS_SCRIPT_URL, orderData);

    return data;
  },

  prepareOrderPayload(formData, cartItems, total, userId) {
    return {
      user_id: userId || null,
      full_name: formData.fullName,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      phone: formData.phone,
      items: JSON.stringify(cartItems),
      total_amount: total,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
  },

  // Google Sheets integration hook — call this to send to Apps Script
  async sendToGoogleSheets(orderData) {
    const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    
    if (!WEBHOOK_URL) {
      console.error('CRITICAL: Google Script URL is missing.');
      throw new Error('Order processing configuration missing.');
    }

    console.log('--- GOOGLE SHEETS DISPATCH START ---');
    
    const formData = new URLSearchParams();
    formData.append('fullName', orderData.fullName);
    formData.append('email', orderData.email);
    formData.append('phone', orderData.phone);
    formData.append('address', orderData.address);
    formData.append('city', orderData.city);
    formData.append('pincode', orderData.pincode);
    formData.append('paymentMethod', orderData.paymentMethod);
    formData.append('totalPrice', orderData.totalAmount); 

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Kept no-cors for maximum compatibility with Apps Script
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      console.log('Dispatch Status: Sent to script');
      return true;
    } catch (err) {
      console.error('--- DISPATCH FAILED ---', err);
      throw err;
    }
  },
};
