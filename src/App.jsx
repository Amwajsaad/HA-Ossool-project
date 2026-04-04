import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Assets from "./Pages/Assets/Assets";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Pages/Home/Home";
import Maintenance from "./Pages/Maintenance/Maintenance";
import Employees from "./Pages/Employees/Employees";
import Departments from "./Pages/Departments/Departments";
import Categories from "./Pages/Categories/Categories";
import Locations from "./Pages/Locations/Locations";
import Settings from "./Pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;