import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const quickActions = [
    {
      title: "Dashboard",
      desc: "View charts, reports and performance overview.",
      button: "Open Dashboard",
      path: "/dashboard",
    },
    {
      title: "Assets",
      desc: "Manage, track and update all company assets.",
      button: "Open Assets",
      path: "/assets",
    },
    {
      title: "Maintenance",
      desc: "Track requests and review maintenance operations.",
      button: "Open Maintenance",
      path: "/maintenance",
    },
    {
      title: "Employees",
      desc: "Manage employees and assigned assets records.",
      button: "Open Employees",
      path: "/employees",
    },
  ];

  const recentAssets = [
    { name: "AC Unit", code: "AST-101", status: "Active" },
    { name: "Printer", code: "AST-315", status: "Active" },
    { name: "Projector", code: "AST-402", status: "Maintenance" },
    { name: "Camera", code: "AST-220", status: "Inactive" },
  ];

  const recentMaintenance = [
    { title: "AC inspection", date: "12 Feb 2026", cost: "$250" },
    { title: "Printer repair", date: "10 Feb 2026", cost: "$180" },
    { title: "Projector cleaning", date: "08 Feb 2026", cost: "$120" },
  ];

  return (
    <div className="ui-page">
      <div className={styles.heroCard}>
        <div>
          <p className={styles.welcomeText}>Welcome back</p>
          <h1 className={styles.heroTitle}>
            {user?.name ? `${user.name}` : "Admin"}, manage your assets smarter
          </h1>
          <p className={styles.heroDesc}>
            Use the quick actions below to move faster between your system pages
            and keep track of assets, maintenance, employees, and settings.
          </p>

          <div className={styles.heroActions}>
            <button
              className="ui-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Open Dashboard
            </button>

            <button
              className="ui-btn-secondary"
              onClick={() => navigate("/assets")}
            >
              View Assets
            </button>
          </div>
        </div>

        <div className={styles.heroBadge}>
          <span>Asset System</span>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2>Quick Actions</h2>
          <p>Fast navigation to the most important pages.</p>
        </div>

        <div className={styles.quickGrid}>
          {quickActions.map((item, index) => (
            <div key={index} className="ui-card">
              <h3 className={styles.quickTitle}>{item.title}</h3>
              <p className={styles.quickDesc}>{item.desc}</p>
              <button
                className="ui-btn-secondary"
                onClick={() => navigate(item.path)}
              >
                {item.button}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className="ui-card">
          <div className={styles.sectionHeader}>
            <h2>Recent Assets</h2>
            <p>Last tracked assets in the system.</p>
          </div>

          <div className={styles.listWrapper}>
            {recentAssets.map((item, index) => (
              <div key={index} className={styles.listRow}>
                <div>
                  <h4>{item.name}</h4>
                  <span>{item.code}</span>
                </div>

                <span
                  className={`ui-badge ${
                    item.status === "Active"
                      ? "ui-success"
                      : item.status === "Maintenance"
                      ? "ui-warning"
                      : "ui-danger"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-card">
          <div className={styles.sectionHeader}>
            <h2>Recent Maintenance</h2>
            <p>Latest maintenance activities.</p>
          </div>

          <div className={styles.listWrapper}>
            {recentMaintenance.map((item, index) => (
              <div key={index} className={styles.listRow}>
                <div>
                  <h4>{item.title}</h4>
                  <span>{item.date}</span>
                </div>

                <strong className={styles.costText}>{item.cost}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;