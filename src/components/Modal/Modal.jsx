import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ title, children, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;