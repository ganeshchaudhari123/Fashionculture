import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

const Contact = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    setTimeout(() => {
      setStatus('Message Sent successfully. We will get back to you within 24 hours.');
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          {/* Info */}
          <motion.div 
            className={styles.info}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className={styles.label}>Get in touch</p>
            <h1 className={`display-title ${styles.title}`}>Contact</h1>
            <p className={styles.desc}>
              Questions about an order, wholesale inquiries, or just want to talk culture? 
              Reach out to our team.
            </p>

            <div className={styles.details}>
              <div>
                <h4>General Support</h4>
                <p>support@fashionculture.com</p>
              </div>
              <div>
                <h4>Press & Media</h4>
                <p>press@fashionculture.com</p>
              </div>
              <div>
                <h4>Studio Address</h4>
                <p>123 Creative Studio, Arts District<br/>Los Angeles, CA 90012</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            className={styles.formCol}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className="form-group">
                  <label className="input-label">First Name</label>
                  <input required type="text" className="input-field" placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label className="input-label">Last Name</label>
                  <input required type="text" className="input-field" placeholder="Doe" />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Email</label>
                <input required type="email" className="input-field" placeholder="jane@example.com" />
              </div>

              <div className="form-group">
                <label className="input-label">Inquiry Type</label>
                <select className="input-field" required>
                  <option value="order">Order Status</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="press">Press & Media</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Message</label>
                <textarea required className="input-field" rows="5" placeholder="How can we help?"></textarea>
              </div>

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                Send Message
              </button>

              {status && (
                <p className={styles.statusMsg}>{status}</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
