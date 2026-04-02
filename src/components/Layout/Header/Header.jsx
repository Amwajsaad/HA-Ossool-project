import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png'; 
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="AH-ossooll" className={styles.logo} />
      </div>
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
        <Link to="/register" className={styles.navLink}>Register</Link>
        <Link to="/login" className={styles.navLink}>Login</Link>
      </nav>
    </header>
  );
};

export default Header;