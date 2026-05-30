import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../assets/fashion_culture.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className={`container ${styles.inner}`}>
        {/* Brand Col */}
        <div className={styles.brand}>
          <img src={logo} alt="Fashion Culture" className={styles.logo} />
          <p className={styles.tagline}>
            Wear The Culture.<br />
            Live The Aesthetic.
          </p>
          <div className={styles.socials}>
            {[
              { label: 'Instagram', icon: <InstagramIcon /> },
              { label: 'Twitter', icon: <TwitterIcon /> },
              { label: 'YouTube', icon: <YouTubeIcon /> },
              { label: 'TikTok', icon: <TikTokIcon /> },
            ].map(({ label, icon }) => (
              <a key={label} href="#" className={styles.socialBtn} aria-label={label}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Col */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Shop</h4>
          <ul>
            {['All Products', 'T-Shirts', 'Hoodies', 'Jackets', 'Bottoms', 'Accessories'].map(l => (
              <li key={l}><Link to="/shop">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company Col */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Company</h4>
          <ul>
            {[
              { label: 'About Us', to: '/about' },
              { label: 'Collections', to: '/collections' },
              { label: 'Contact', to: '/contact' },
              { label: 'Size Guide', to: '/shop' },
              { label: 'Returns', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={label}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Newsletter Col */}
        <div className={styles.newsletter}>
          <h4 className={styles.colTitle}>Stay Updated</h4>
          <p className={styles.newsletterText}>
            Drop alerts, exclusive offers & culture updates — direct to your inbox.
          </p>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
              required
            />
            <button type="submit" className={styles.newsletterBtn}>
              {subscribed ? '✓' : '→'}
            </button>
          </form>
          {subscribed && <p className={styles.subscribeMsg}>You're in. Welcome to the culture.</p>}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>
              © 2025 Fashion Culture. All rights reserved.
              <span style={{ marginLeft: '12px', opacity: 0.8 }}>
                | Website developed by <a href="https://probizo.kesug.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fc-orange-light)', textDecoration: 'none' }}>Probizo</a>
              </span>
            </p>
            <div className={styles.bottomLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.19a8.18 8.18 0 004.78 1.52V6.27a4.85 4.85 0 01-1.01-.58z" />
  </svg>
);

export default Footer;
