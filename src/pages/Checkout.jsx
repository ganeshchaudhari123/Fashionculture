import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '../store';
import { orderService } from '../services';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const subtotal = getTotal();
  const gst = useMemo(() => subtotal * 0.18, [subtotal]); // 18% GST
  const shipping = useMemo(() => (subtotal > 5000 ? 0 : 500), [subtotal]);
  const discount = useMemo(() => (subtotal > 10000 ? subtotal * 0.1 : 0), [subtotal]); // 10% off above 10k
  const finalTotal = useMemo(() => subtotal + gst + shipping - discount, [subtotal, gst, shipping, discount]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'UPI',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setError(null);

    const orderId = `FC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderDate = new Date().toLocaleString();

    const orderPayload = {
      orderId,
      orderDate,
      ...formData,
      items: items.map(item => ({
        title: item.title,
        size: item.size,
        color: item.color || 'N/A',
        quantity: item.quantity,
        price: item.price,
        image: item.imageUrl
      })),
      subtotal,
      gst,
      shipping,
      discount,
      totalAmount: finalTotal
    };

    try {
      // 1. Submit to Supabase
      try {
        await orderService.submitOrder({
          full_name: orderPayload.fullName,
          address: orderPayload.address,
          city: orderPayload.city,
          pincode: orderPayload.pincode,
          phone: orderPayload.phone,
          items: JSON.stringify(orderPayload.items),
          total_amount: orderPayload.totalAmount,
          status: 'pending'
        });
        console.log('Supabase sync: Success');
      } catch (supabaseErr) {
        console.warn('Supabase sync: Skipped/Error (Check table structure or Auth)', supabaseErr);
      }

      // 2. Submit to Google Sheets via Webhook
      console.log('Initiating Google Sheets sync...');
      await orderService.sendToGoogleSheets(orderPayload);
      console.log('Google Sheets sync: Dispatched');

      clearCart();
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Unable to process order. Please check your connection.');
      console.error('Final Submission Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className={styles.emptyState}>
        <div className="container">
          <h2 className="display-title">Your bag is empty</h2>
          <p>Add some culture to your wardrobe before checking out.</p>
          <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="checkout-form"
              className={styles.grid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Left: Form */}
              <div className={styles.formSection}>
                <h1 className={`display-title ${styles.pageTitle}`}>Checkout</h1>
                
                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formBlock}>
                    <h3 className={styles.blockTitle}>Delivery Details</h3>
                    <div className={styles.inputGroup}>
                      <label className="input-label">Full Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div className={styles.row}>
                      <div className={styles.inputGroup}>
                        <label className="input-label">Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className="input-label">Phone Number</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className="input-label">Shipping Address</label>
                      <textarea required name="address" value={formData.address} onChange={handleChange} className="input-field" rows="3" placeholder="Flat No, Building, Street..." />
                    </div>
                    <div className={styles.row}>
                      <div className={styles.inputGroup}>
                        <label className="input-label">City</label>
                        <input required name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="Mumbai" />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className="input-label">Pincode</label>
                        <input required name="pincode" value={formData.pincode} onChange={handleChange} className="input-field" placeholder="400001" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formBlock}>
                    <h3 className={styles.blockTitle}>Payment Method</h3>
                    <div className={styles.paymentOptions}>
                      {['UPI', 'Card', 'COD'].map(method => (
                        <label key={method} className={`${styles.paymentLabel} ${formData.paymentMethod === method ? styles.active : ''}`}>
                          <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className={`btn btn-primary ${styles.payBtn}`} disabled={loading}>
                    {loading ? (
                      <span className={styles.loader}>Processing...</span>
                    ) : (
                      `Complete Order • ₹${finalTotal.toLocaleString()}`
                    )}
                  </button>
                </form>
              </div>

              {/* Right: Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summarySticky}>
                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Bag Summary ({items.length})</h3>
                    <div className={styles.itemsList}>
                      {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className={styles.cartItem}>
                          <img src={item.imageUrl} alt={item.title} className={styles.itemImg} />
                          <div className={styles.itemDetails}>
                            <h4 className={styles.itemTitle}>{item.title}</h4>
                            <p className={styles.itemMeta}>Size: {item.size} • Qty: {item.quantity}</p>
                            <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.costLines}>
                      <div className={styles.line}>
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className={styles.line}>
                        <span>GST (18%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className={styles.line}>
                        <span>Shipping</span>
                        <span className={shipping === 0 ? styles.free : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                      </div>
                      {discount > 0 && (
                        <div className={`${styles.line} ${styles.discountLine}`}>
                          <span>Discount</span>
                          <span>-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className={`${styles.line} ${styles.finalTotal}`}>
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className={styles.deliveryInfo}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      Estimated delivery: 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-screen"
              className={styles.successScreen}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.successIcon}>
                <motion.svg 
                  width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              </div>
              <h2 className="display-title">Order Placed!</h2>
              <p>Your style journey has begun. We've sent a confirmation to your email.</p>
              <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
