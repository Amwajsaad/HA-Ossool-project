import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./Settings.module.css";
import { settingsSchema } from "./SettingsSchema";
import Swal from "sweetalert2";

const defaultSettings = {
  companyName: "AH-Ossooll",
  supportEmail: "support@ah-ossooll.com",
  theme: "Light",
  language: "English",
  notifications: true,
};

const STORAGE_KEY = "settings_data";

const Settings = () => {
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

  const swalButtons = {
    confirmButtonColor: "#c62828",
    cancelButtonColor: "#9e9e9e",
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reset(JSON.parse(saved));
    }
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      Swal.fire({
        title: "Success!",
        text: "Settings saved successfully.",
        icon: "success",
        confirmButtonColor: "#c62828",
      });
    } catch (error) {
      console.error("Save error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving settings.",
        icon: "error",
        confirmButtonColor: "#c62828",
      });
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset Settings?",
      text: "This will restore the default settings.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      ...swalButtons,
    });

    if (!result.isConfirmed) return;

    reset(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);

    Swal.fire({
      title: "Reset Done!",
      text: "Settings restored successfully.",
      icon: "success",
      confirmButtonColor: "#c62828",
    });
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

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