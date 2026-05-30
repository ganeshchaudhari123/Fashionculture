import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>Your Cart</h2>
                <p className={styles.subtitle}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button className={styles.closeBtn} onClick={closeCart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className={styles.itemsList}>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <p>Your cart is empty</p>
                    <button className="btn btn-outline" onClick={closeCart}>
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      className={styles.item}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                    >
                      <div className={styles.itemImage}>
                        <img src={item.imageUrl} alt={item.title} loading="lazy" />
                      </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemTitle}>{item.title}</p>
                        <p className={styles.itemMeta}>Size: {item.size}</p>
                        <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</p>
                        <div className={styles.qtyControl}>
                          <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id, item.size)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalAmount}>₹{total.toLocaleString()}</span>
                </div>
                <p className={styles.shippingNote}>Shipping calculated at checkout</p>
                <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }} onClick={closeCart}>
                  Checkout
                </Link>
                <button className={styles.continueShopping} onClick={closeCart}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
