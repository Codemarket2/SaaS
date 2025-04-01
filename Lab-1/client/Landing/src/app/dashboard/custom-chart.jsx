/**
 * CustomBarChart screen
 */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

const CustomBarChart = ({ data, height }) => {
  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="SeriesA"
            fill="#ffc4d8"
            activeBar={<Rectangle fill="#f8b7cd" stroke="#f25e90" />}
          />
          <Bar
            dataKey="SeriesB"
            fill="#c8e7f5"
            activeBar={<Rectangle fill="#9fd5ed" stroke="#3891e0" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
