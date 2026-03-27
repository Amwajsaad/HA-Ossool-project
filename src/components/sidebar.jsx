import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <img src="/logo.png" alt="AH-OSSOOL" className="sidebar__logo" />

        <div className="sidebar__profile">
          <img
            src="/login-image.JPG"
            alt="Naser"
            className="sidebar__profile-image"
          />
        </div>

        <div className="sidebar__menu">
          <div className="sidebar__item">Home</div>
          <div className="sidebar__item active">Dashboard</div>
          <div className="sidebar__item">Assets</div>
          <div className="sidebar__item">Maintenance</div>

          <div className="sidebar__divider"></div>

          <div className="sidebar__item">Categories</div>
          <div className="sidebar__item">Location</div>
          <div className="sidebar__item">Settings</div>
        </div>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__logout">Log out</div>
      </div>
    </div>
  );
};

export default Sidebar;