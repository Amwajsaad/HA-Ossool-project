import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Navbar يظهر فقط داخل dashboard */}
      {location.pathname === "/dashboard" && (
        <nav
          style={{
            padding: "20px",
            backgroundColor: "#f4f4f4",
            display: "flex",
            gap: "20px",
          }}
        >
          <Link to="/">تسجيل الدخول</Link>
          <Link to="/register">إنشاء حساب</Link>
          <Link to="/dashboard">لوحة التحكم</Link>
        </nav>
      )}

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;