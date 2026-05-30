import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, quantity = 1) => {
        const { items } = get();
        const existing = items.find(i => i.id === product.id && i.size === size);
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, size, quantity }] });
        }
      },

      removeItem: (id, size) => {
        set({ items: get().items.filter(i => !(i.id === id && i.size === size)) });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map(i =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const items = get().items;
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getCount: () => {
        const items = get().items;
        return items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: 'fashion-culture-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, session: null }),
}));
