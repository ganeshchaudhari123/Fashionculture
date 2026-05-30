import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal texts
      gsap.from('.reveal-text', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page} ref={containerRef}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`ambient-orb orb-red ${styles.orb}`} />
        <div className="container">
          <motion.h1 
            className={`display-title ${styles.title}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            We Are<br />
            <span className="gradient-text">Fashion Culture</span>
          </motion.h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className={styles.philosophy} ref={textRef}>
        <div className="container">
          <div className={styles.philGrid}>
            <div className={styles.philContent}>
              <p className={`reveal-text ${styles.label}`}>The Philosophy</p>
              <h2 className={`reveal-text section-title ${styles.philTitle}`}>
                More than clothes.<br />An identity.
              </h2>
              <div className={`reveal-text ${styles.philText}`}>
                <p>
                  Born in the neon-lit streets, Fashion Culture is a premium streetwear brand that bridges the gap between high fashion and underground aesthetics.
                </p>
                <p>
                  We don't follow trends; we observe the culture and design the uniform for the outliers, the creators, and the visionaries. Every product is conceptualized, engineered, and crafted to deliver maximum visual impact without compromising on comfort.
                </p>
              </div>
            </div>

            <div className={styles.images}>
              <motion.img 
                src="https://images.unsplash.com/photo-1552599266-96b4dd95d7e5?w=600" 
                alt="Studio" 
                className={styles.img1}
                style={{ y: y1 }}
              />
              <motion.img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" 
                alt="Model" 
                className={styles.img2}
                style={{ y: y2 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className="container">
          <h2 className={`section-title ${styles.valSectionTitle}`}>Our DNA</h2>
          <div className="section-divider" />
          
          <div className={styles.valGrid}>
            {[
              { num: '01', title: 'Premium Construction', desc: 'Heavyweight cottons, custom hardware, and meticulous stitching. Built to outlast the season.' },
              { num: '02', title: 'Limited Production', desc: 'We artificially cap our runs to ensure exclusivity. When a drop is gone, it rarely returns.' },
              { num: '03', title: 'Sartorial Innovation', desc: 'Pushing the boundaries of silhouette and proportion. The perfect oversized fit.' },
            ].map(({ num, title, desc }, i) => (
              <motion.div 
                key={num} 
                className={styles.valCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                <span className={`display-title ${styles.valNum}`}>{num}</span>
                <h3 className={styles.valTitle}>{title}</h3>
                <p className={styles.valDesc}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
