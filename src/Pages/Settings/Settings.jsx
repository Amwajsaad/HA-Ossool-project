import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Settings.module.css";
import { settingsSchema } from "./SettingsSchema";

const defaultSettings = {
  companyName: "AH-Ossooll",
  supportEmail: "support@ah-ossooll.com",
  theme: "Light",
  language: "English",
  notifications: true,
};

const STORAGE_KEY = "settings_data";

const Settings = () => {
  const [savedMessage, setSavedMessage] = useState("");

  const savedSettings = localStorage.getItem(STORAGE_KEY);
  const initialValues = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: "all",
    defaultValues: initialValues,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reset(JSON.parse(saved));
    }
  }, [reset]);

  const onSubmit = async (data) => {
    console.log(data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

    reset(defaultSettings);
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
          <button className="ui-btn-secondary" onClick={handleReset} type="button">
            Reset
          </button>
          <button
            className="ui-btn-primary"
            type="submit"
            form="settings-form"
            disabled={isSubmitting}
          >
            Save Changes
          </button>
        </div>
      </div>

      {savedMessage && <div className={styles.successMessage}>{savedMessage}</div>}

      <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.settingsGrid}>
          <div className="ui-card">
            <h3 className={styles.cardTitle}>General Settings</h3>

            <div className={styles.formGroup}>
              <label>Company Name</label>
              <input
                className="ui-input"
                type="text"
                {...register("companyName")}
              />
              {errors.companyName && (
                <span className={styles.errorText}>
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Support Email</label>
              <input
                className="ui-input"
                type="email"
                {...register("supportEmail")}
              />
              {errors.supportEmail && (
                <span className={styles.errorText}>
                  {errors.supportEmail.message}
                </span>
              )}
            </div>
          </div>

          <div className="ui-card">
            <h3 className={styles.cardTitle}>Appearance</h3>

            <div className={styles.formGroup}>
              <label>Theme</label>
              <select className="ui-input" {...register("theme")}>
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Language</label>
              <select className="ui-input" {...register("language")}>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
          </div>

          <div className={`ui-card ${styles.fullWidthCard}`}>
            <h3 className={styles.cardTitle}>Notifications</h3>

            <label className={styles.checkboxRow}>
              <input type="checkbox" {...register("notifications")} />
              <span>Enable system notifications</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;