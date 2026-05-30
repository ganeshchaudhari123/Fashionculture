import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState('default');
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.from(headerRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    list = list.filter(p => p.price <= maxPrice);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [selectedCategory, search, maxPrice, sort]);

  return (
    <div className={styles.shop}>
      {/* Header */}
      <div className={styles.shopHeader} ref={headerRef}>
        <div className={`ambient-orb orb-orange ${styles.orb}`} />
        <div className="container">
          <p className={styles.label}>Explore</p>
          <h1 className={`display-title ${styles.title}`}>The Shop</h1>
          <p className={styles.subtitle}>
            {filtered.length} products — Premium streetwear, limited edition drops
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters Bar */}
        <div className={styles.filtersBar}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Sort */}
          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            {/* Categories */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Category</h3>
              <div className={styles.categoryList}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.catBtn} ${selectedCategory === cat ? styles.catActive : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Max Price</h3>
              <p className={styles.priceDisplay}>
                Up to <span>₹{maxPrice.toLocaleString()}</span>
              </p>
              <input
                type="range"
                min={499}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className={styles.priceSlider}
              />
              <div className={styles.priceMinMax}>
                <span>₹499</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Reset */}
            <button
              className={`btn btn-ghost ${styles.resetBtn}`}
              onClick={() => { setSelectedCategory('All'); setSearch(''); setMaxPrice(10000); setSort('default'); }}
            >
              Reset Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div className={styles.gridArea}>
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  className={styles.noResults}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>🔍</span>
                  <p>No products found</p>
                  <button className="btn btn-outline" onClick={() => { setSelectedCategory('All'); setSearch(''); setMaxPrice(10000); }}>
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  className={styles.productGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                      layout
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
