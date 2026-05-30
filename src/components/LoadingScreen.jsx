import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './LoadingScreen.module.css';
import logo from '../assets/fashion_culture.png';

const LoadingScreen = ({ onComplete }) => {
  const screenRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(screenRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    tl.from(logoRef.current, { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' })
      .from(textRef.current, { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
      .to(barRef.current, { width: '100%', duration: 1.8, ease: 'power2.inOut' }, '-=0.2')
      .to(logoRef.current, { scale: 1.05, opacity: 0.6, duration: 0.3, ease: 'power2.in' }, '+=0.1');
  }, [onComplete]);

  return (
    <div className={styles.screen} ref={screenRef}>
      <div className={styles.content}>
        <div className={styles.logoWrap} ref={logoRef}>
          <img src={logo} alt="Fashion Culture" className={styles.logo} />
        </div>
        <p className={styles.tagline} ref={textRef}>Wear The Culture</p>
        <div className={styles.barWrapper}>
          <div className={styles.bar} ref={barRef} />
        </div>
      </div>
      <div className={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.particle} style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
