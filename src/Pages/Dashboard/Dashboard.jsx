import "./Dashboard.css";
import Sidebar from "../../components/sidebar";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const pieSeries = [35, 25, 20, 20];

  const pieOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Active", "Under Maintenance", "Inactive", "Retired"],
    legend: {
      position: "right",
    },
    colors: ["#2e7d32", "#d97706", "#c62828", "#2563eb"],
    dataLabels: {
      enabled: false,
    },
  };

  const barSeries = [
    {
      name: "Maintenance Cost",
      data: [4000, 9500, 7000, 5000, 3000, 1800, 1200, 5000, 5200, 5100, 5000, 4800],
    },
  ];

  const barOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#c71d1d"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$" + val;
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "55%",
      },
    },
    grid: {
      borderColor: "#eee",
    },
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard__content">
        <div className="dashboard__header">
          <h2>Dashboard</h2>
        </div>

        <div className="dashboard__topbar">
          <div className="dashboard__search-wrap">
            <span className="dashboard__search-icon">⌕</span>
            <input type="text" placeholder="Search" className="search" />
          </div>

          <div className="user">
            <div className="user__notify">🔔</div>
            <img src="/logo.png" alt="user" />
            <div className="user__info">
              <strong>Naser</strong>
              <span>Admin</span>
            </div>
            <span className="user__arrow">⌄</span>
          </div>
        </div>

        <div className="dashboard__cards">
          <div className="card">
            <p className="card__title">Total Assets</p>
            <h3 className="card__number">128</h3>
            <span className="card__text">Assets 128</span>
          </div>

          <div className="card">
            <p className="card__title">Active Assets</p>
            <h3 className="card__number">102</h3>
            <span className="card__text">Assets 102</span>
          </div>

          <div className="card">
            <p className="card__title">Maintenance</p>
            <h3 className="card__number">18</h3>
            <span className="card__text">Total 18</span>
          </div>

          <div className="card">
            <p className="card__title">Asset Value</p>
            <h3 className="card__number">$1,250,000</h3>
            <span className="card__text">Current value</span>
          </div>
        </div>

        <div className="dashboard__charts">
          <div className="chart-card">
            <h3 className="chart-card__title">Asset Distribution By Status</h3>
            <Chart
              options={pieOptions}
              series={pieSeries}
              type="donut"
              height={300}
            />
          </div>

          <div className="chart-card">
            <h3 className="chart-card__title">Maintenance Cost by Month</h3>
            <Chart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={300}
            />
          </div>
        </div>

        <h3 className="table-title">Asset Table</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>ID</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>AC Unit</td>
              <td>0101</td>
              <td className="status active">Active</td>
              <td>Office</td>
            </tr>

            <tr>
              <td>Camera</td>


<td>0220</td>
              <td className="status inactive">Inactive</td>
              <td>Warehouse</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;