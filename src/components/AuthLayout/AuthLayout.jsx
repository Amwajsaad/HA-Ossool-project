import React from "react";
import styles from "./AuthLayout.module.css";
import logo from "../../assets/logo.png";
import hero from "../../assets/login-image.JPG";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className={styles.page}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <img src={logo} alt="logo" />
        <h2>AH-ossooll</h2>
      </div>

      {/* CONTENT */}
      <div className={styles.container}>
        
        {/* LEFT */}
        <div className={styles.left}>
          <h1>{title}</h1>
          <p>{subtitle}</p>

          <div className={styles.form}>
            {children}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <img src={hero} alt="illustration" />
        </div>

      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <div>
          <h4>Product</h4>
          <p>Employee Assets</p>
          <p>Asset Tracking</p>
        </div>

        <div>
          <h4>Information</h4>
          <p>FAQ</p>
          <p>Blog</p>
        </div>

        <div>
          <h4>Company</h4>
          <p>About us</p>
          <p>Contact us</p>
        </div>

        <div>
          <h4>Contact Our Team</h4>
          <p>Feel free to reach out we're happy to assist you.</p>
          <button>Contact Us!</button>
        </div>
      </div>

    </div>
  );
}