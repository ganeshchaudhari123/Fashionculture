import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, collections } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const particlesRef = useRef(null);
  const featuredRef = useRef(null);
  const collectionsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(heroTextRef.current?.querySelectorAll('.hero-line'), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power4.out',
      })
        .from(heroSubRef.current, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from(heroBtnsRef.current?.children, { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4');

      // Parallax on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // Features reveal
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: featuredRef.current, start: 'top 80%' },
      });

      // Mouse parallax
      const onMouse = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        gsap.to('.parallax-orb', { x, y, duration: 1.5, ease: 'power2.out', overwrite: true });
      };
      window.addEventListener('mousemove', onMouse);

      return () => window.removeEventListener('mousemove', onMouse);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className={styles.home}>
      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>
        {/* Ambient background */}
        <div className={`${styles.heroBg} hero-bg`} />
        <div className={`ambient-orb orb-orange parallax-orb ${styles.orb1}`} />
        <div className={`ambient-orb orb-red parallax-orb ${styles.orb2}`} />

        {/* Particles */}
        <div className={styles.particles} ref={particlesRef}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle} style={{ '--i': i }} />
          ))}
        </div>

        {/* Content */}
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <div className={styles.heroText} ref={heroTextRef}>
                <div className={styles.heroLine}>
                  <span className={`display-title ${styles.heroTitle} hero-line`}>
                    FASHION
                  </span>
                </div>
                <div className={styles.heroLine}>
                  <span className={`display-title ${styles.heroTitleAccent} hero-line`}>
                    CULTURE
                  </span>
                </div>
                <div className={styles.heroLine}>
                  <span className={`display-title ${styles.heroTitleSub} hero-line`}>
                    Define Your Era
                  </span>
                </div>
              </div>

              <p className={styles.heroSub} ref={heroSubRef}>
                Premium streetwear for the generation that moves culture forward.
                <br />
                Limited drops. Unlimited expression.
              </p>

              <div className={styles.heroBtns} ref={heroBtnsRef}>
                <Link to="/shop" className="btn btn-primary">
                  Shop Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/collections" className="btn btn-outline">
                  Explore Collections
                </Link>
              </div>

              {/* Stats */}
              <div className={styles.heroStats}>
                {[
                  { num: '25+', label: 'Products' },
                  { num: '4', label: 'Collections' },
                  { num: '100%', label: 'Premium Quality' },
                ].map(({ num, label }) => (
                  <div key={label} className={styles.stat}>
                    <span className={styles.statNum}>{num}</span>
                    <span className={styles.statLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heroRight}>
               <div className={styles.heroImageWrapper}>
                 <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000" alt="Streetwear Model" className={styles.heroImage} />
               </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className={styles.marqueeContent}>
              {['Fashion Culture', '✦', 'Premium Streetwear', '✦', 'Wear The Culture', '✦', 'New Drop 2025', '✦', 'Limited Edition', '✦'].join(' ')}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className={styles.featured} ref={featuredRef}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>Featured</p>
              <h2 className={`section-title ${styles.sectionTitle}`}>Latest Drops</h2>
              <div className="section-divider" />
            </div>
            <Link to="/shop" className={`btn btn-outline ${styles.viewAll}`}>
              View All →
            </Link>
          </div>

          <div className={styles.productGrid}>
            {featuredProducts.map((p) => (
              <div key={p.id} className="feature-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      <section className={styles.collectionsSection} ref={collectionsRef}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>Explore</p>
              <h2 className={`section-title ${styles.sectionTitle}`}>Collections</h2>
              <div className="section-divider" />
            </div>
          </div>

          <div className={styles.collectionsGrid}>
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                className={styles.collectionCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.collectionImage}>
                  <img src={col.imageUrl} alt={col.name} loading="lazy" />
                  <div className={styles.collectionOverlay} style={{ background: `linear-gradient(to top, ${col.color}CC 0%, transparent 60%)` }} />
                </div>
                <div className={styles.collectionBody}>
                  <p className={styles.collectionSub}>{col.subtitle}</p>
                  <h3 className={`section-title ${styles.collectionName}`}>{col.name}</h3>
                  <p className={styles.collectionDesc}>{col.description}</p>
                  <Link to="/shop" className={styles.collectionCta}>
                    Shop Now →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND PROMISE ── */}
      <section className={styles.promise}>
        <div className="container">
          <div className={styles.promiseGrid}>
            {[
              { icon: '🔥', title: 'Limited Drops', desc: 'Exclusive releases that sell out fast. Be first.' },
              { icon: '✦', title: 'Premium Quality', desc: 'Heavyweight fabrics. Superior construction. Unmatched fit.' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Express shipping available. Culture delivered to your door.' },
              { icon: '♻', title: 'Sustainable', desc: 'Ethically sourced materials. Fashion with a conscience.' },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                className={styles.promiseCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                whileHover={{ borderColor: 'rgba(255,69,0,0.3)' }}
              >
                <span className={styles.promiseIcon}>{icon}</span>
                <h4 className={styles.promiseTitle}>{title}</h4>
                <p className={styles.promiseDesc}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaGlow} />
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`display-title ${styles.ctaTitle}`}>
              New Season.<br />
              <span className="gradient-text">New Identity.</span>
            </h2>
            <p className={styles.ctaDesc}>
              The SS25 Collection is here. Limited quantities. Premium cuts.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Shop the Drop
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
