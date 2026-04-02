import React from 'react';
import styles from "./Dashboard.module.css";
import Sidebar from "../../components/sidebar";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const pieSeries = [35, 25, 20, 20];
  const pieOptions = {
    chart: { type: "donut" },
    labels: ["Active", "Under Maintenance", "Inactive", "Retired"],
    legend: { position: "right" },
    colors: ["#2e7d32", "#d97706", "#c62828", "#2563eb"],
    dataLabels: { enabled: false },
  };

  const barSeries = [{
    name: "Maintenance Cost",
    data: [4000, 9500, 7000, 5000, 3000, 1800, 1200, 5000, 5200, 5100, 5000, 4800],
  }];

  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#c71d1d"],
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
    yaxis: { labels: { formatter: (val) => "$" + val } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
  };

  return (
    <div className="dashboard" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="dashboard__content" style={{ flex: 1, padding: '20px' }}>
        <div className="dashboard__header">
          <h2>Dashboard</h2>
        </div>
        <div className="dashboard__topbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div className="dashboard__search-wrap">
            <input type="text" placeholder="Search" className="search" />
          </div>
          <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="user" style={{ width: '30px' }} />
            <div className="user__info">
              <strong>Naser</strong><br/>
              <span>Admin</span>
            </div>
          </div>
        </div>
        <div className="dashboard__charts" style={{ display: 'flex', gap: '20px' }}>
          <Chart options={pieOptions} series={pieSeries} type="donut" height={300} />
          <Chart options={barOptions} series={barSeries} type="bar" height={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;