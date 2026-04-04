import React, { useEffect, useState } from "react";
import styles from "./Settings.module.css";

const defaultSettings = {
  companyName: "AH-Ossooll",
  supportEmail: "support@ah-ossooll.com",
  theme: "Light",
  language: "English",
  notifications: true,
};

const STORAGE_KEY = "settings_data";

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedMessage("Settings saved successfully.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "This will reset settings to default values. Continue?"
    );

    if (!confirmReset) return;

    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    setSavedMessage("Settings reset to default.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Settings</h2>
          <p className="ui-subtitle">
            Manage your system preferences and basic configuration.
          </p>
        </div>

        <div className="ui-actions">
          <button className="ui-btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="ui-btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {savedMessage && <div className={styles.successMessage}>{savedMessage}</div>}

      <div className={styles.settingsGrid}>
        <div className="ui-card">
          <h3 className={styles.cardTitle}>General Settings</h3>

          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              className="ui-input"
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Support Email</label>
            <input
              className="ui-input"
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ui-card">
          <h3 className={styles.cardTitle}>Appearance</h3>

          <div className={styles.formGroup}>
            <label>Theme</label>
            <select
              className="ui-input"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Language</label>
            <select
              className="ui-input"
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>

        <div className={`ui-card ${styles.fullWidthCard}`}>
          <h3 className={styles.cardTitle}>Notifications</h3>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />
            <span>Enable system notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;