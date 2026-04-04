import React from "react";
import styles from "./Dashboard.module.css";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Assets",
      number: "128",
      sub: "+12 this month",
    },
    {
      title: "Active Assets",
      number: "102",
      sub: "80% active",
    },
    {
      title: "Maintenance Requests",
      number: "18",
      sub: "5 pending",
    },
    {
      title: "Asset Value",
      number: "$1,250,000",
      sub: "Updated recently",
    },
  ];

  const pieSeries = [35, 25, 20, 20];

  const pieOptions = {
    chart: { type: "donut" },
    labels: ["Active", "Maintenance", "Inactive", "Retired"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
  };

  const barSeries = [
    {
      name: "Maintenance Cost",
      data: [4000, 9500, 7000, 5000, 3000, 1800, 1200, 5000, 5200, 5100, 5000, 4800],
    },
  ];

  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
      },
    },
  };

  return (
    <div className="ui-page">
      <div className="ui-page-header">
        <div>
          <h2 className="ui-title">Dashboard</h2>
          <p className="ui-subtitle">
            Overview of your system performance and assets.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((item, index) => (
          <div key={index} className="ui-card">
            <h4 className={styles.statTitle}>{item.title}</h4>
            <div className={styles.statNumber}>{item.number}</div>
            <p className={styles.statSub}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className="ui-card">
          <h3 className={styles.cardTitle}>
            Asset Distribution
          </h3>
          <Chart
            options={pieOptions}
            series={pieSeries}
            type="donut"
            height={280}
          />
        </div>

        <div className="ui-card">
          <h3 className={styles.cardTitle}>
            Maintenance Cost
          </h3>
          <Chart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={280}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;