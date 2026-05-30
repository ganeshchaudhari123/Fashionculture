import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { collections } from '../data/products';
import styles from './Collections.module.css';

const Collections = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.col-text', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page} ref={pageRef}>
      <div className="container">
        <div className={styles.header}>
          <p className={`col-text ${styles.label}`}>Discover</p>
          <h1 className={`col-text display-title ${styles.title}`}>Collections</h1>
          <p className={`col-text ${styles.subtitle}`}>Curated capsules defining the current era of streetwear.</p>
        </div>

        <div className={styles.list}>
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              className={styles.collection}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={`${styles.imageWrap} ${index % 2 !== 0 ? styles.imageRight : ''}`}
              >
                <div className={styles.imageInner}>
                  <img src={col.imageUrl} alt={col.name} />
                  <div className={styles.overlay} />
                </div>

                <motion.div
                  className={styles.content}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className={styles.colSub} style={{ color: col.color }}>{col.subtitle}</p>
                  <h2 className={`display-title ${styles.colName}`}>{col.name}</h2>
                  <p className={styles.colDesc}>{col.description}</p>
                  
                  <Link to="/shop" className={`btn btn-primary ${styles.btn}`} style={{ background: col.color }}>
                    Explore Drop
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
