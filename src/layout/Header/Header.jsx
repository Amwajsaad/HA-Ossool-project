import React from "react";
import styles from "./Header.module.css";
import profileImage from "../../assets/login-image.JPG";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <header className={styles.header}>
      <div className={styles.searchBox}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
      </div>

      <div className={styles.headerRight}>
        <span className={styles.bell}>🔔</span>

        <div className={styles.profile}>
          <img src={profileImage} alt="User" className={styles.profileImage} />
          <div className={styles.profileInfo}>
            <h4>{user?.username || user?.email || "User"}</h4>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;