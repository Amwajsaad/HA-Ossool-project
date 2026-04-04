import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Sidebar from "../components/sidebar";

const Layout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" }}>
      <Header />

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Sidebar />

        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;