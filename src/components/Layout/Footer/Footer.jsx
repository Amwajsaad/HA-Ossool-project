import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.column}>
          <h3>Product</h3>
          <ul>
            <li>Employee Assets</li>
            <li>Asset Tracking</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Information</h3>
          <ul>
            <li>FAQ</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Company</h3>
          <ul>
            <li>About us</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div className={styles.contactCard}>
          <h4>Contact Our Team</h4>
          <p>Feel free to reach out we're happy to assist you.</p>
          <button className={styles.contactBtn}>Contact Us!</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;