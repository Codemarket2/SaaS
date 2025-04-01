import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],

    datasets: [
      {
        label: "Traffic",
        data: [
          100, 80, 120, 140, 60, 100, 200, 100, 80, 120, 140, 60, 100, 200,
        ],
        borderColor: "rgba(102, 119, 153, 1)", // Blue-gray line
        backgroundColor: "rgba(102, 119, 153, 0.2)", // Light blue-gray fill
        pointBorderColor: "rgba(102, 119, 153, 1)", // Point color
        pointBackgroundColor: "#fff",
        tension: 0.4, // Smooth line
        fill: true,
      },
      {
        label: "Baseline",
        data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        borderColor: "rgba(255, 0, 0, 1)", // Red line
        borderDash: [5, 5], // Dashed line
        fill: {
          target: "origin",
          above: "rgba(255, 0, 0, 0.1)", // Light red fill above the line
          below: "rgba(255, 0, 0, 0.1)", // Light red fill below the line
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#666", // Legend text color
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666", // X-axis label color
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Light grid lines
        },
      },
      y: {
        ticks: {
          color: "#666", // Y-axis label color
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Light grid lines
        },
        beginAtZero: true,
      },
    },
  };
  const data1 = useSelector((state) => state?.authSlice?.user);
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg w-full mx-auto">
      <h2 className="text-xl font-semibold mb-2">Traffic</h2>
      <p className="text-sm text-gray-500 mb-4">December 2020</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default Dashboard;
