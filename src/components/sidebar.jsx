import styles from "./sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import profileImage from "../assets/login-image.JPG";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        <img src={logo} alt="AH-OSSOOL" className={styles.sidebar__logo} />

        <div className={styles.sidebar__profile}>
          <img
            src={profileImage}
            alt="Naser"
            className={styles.sidebar__profileImage}
          />
        </div>

        <nav className={styles.sidebar__menu}>
          <div
            className={`${styles.sidebar__item} ${
              isActive("/home") ? styles.active : ""
            }`}
            onClick={() => navigate("/home")}
          >
            Home
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/dashboard") ? styles.active : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/assets") ? styles.active : ""
            }`}
            onClick={() => navigate("/assets")}
          >
            Assets
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/maintenance") ? styles.active : ""
            }`}
            onClick={() => navigate("/maintenance")}
          >
            Maintenance
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/employees") ? styles.active : ""
            }`}
            onClick={() => navigate("/employees")}
          >
            Employees
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/departments") ? styles.active : ""
            }`}
            onClick={() => navigate("/departments")}
          >
            Departments
          </div>

          <div className={styles.sidebar__divider}></div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/categories") ? styles.active : ""
            }`}
            onClick={() => navigate("/categories")}
          >
            Categories
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/locations") ? styles.active : ""
            }`}
            onClick={() => navigate("/locations")}
          >
            Locations
          </div>

          <div
            className={`${styles.sidebar__item} ${
              isActive("/settings") ? styles.active : ""
            }`}
            onClick={() => navigate("/settings")}
          >
            Settings
          </div>
        </nav>
      </div>

      <div className={styles.sidebar__bottom}>
        <div className={styles.sidebar__logout} onClick={handleLogout}>
          Log out
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;