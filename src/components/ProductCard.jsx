import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const badgeMap = {
    NEW: 'badge-new',
    LIMITED: 'badge-limited',
    BESTSELLER: 'badge-bestseller',
  };

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Link to={`/product/${product.id}`} className={styles.imageWrap}>
        {product.badge && (
          <span className={`badge ${badgeMap[product.badge]} ${styles.badge}`}>
            {product.badge}
          </span>
        )}
        <img
          src={product.imageUrl}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
      </Link>

      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>
        <div className={styles.footer}>
          <span className={styles.price}>₹{product.price.toLocaleString()}</span>
          <motion.button
            className={`${styles.addBtn} ${added ? styles.added : ''}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
          >
            {added ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
