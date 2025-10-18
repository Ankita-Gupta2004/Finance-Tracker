// ExpensesAreaChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpensesAreaChart() {
  const [financeData, setFinanceData] = useState(null);

  // Fetch data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("financeData");
    if (storedData) {
      setFinanceData(JSON.parse(storedData));
    }
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!financeData) return [];

    const sumAmount = (arr) =>
      arr?.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 0;

    return [
      {
        category: "Essential",
        amount: sumAmount(financeData.essentialExpenses),
        items: financeData.essentialExpenses,
      },
      {
        category: "Discretionary",
        amount: sumAmount(financeData.discretionaryExpenses),
        items: financeData.discretionaryExpenses,
      },
      {
        category: "Education",
        amount: sumAmount(financeData.educationExpenses),
        items: financeData.educationExpenses,
      },
      {
        category: "Family",
        amount: sumAmount(financeData.familyExpenses),
        items: financeData.familyExpenses,
      },
      {
        category: "Insurance",
        amount: sumAmount(financeData.insuranceExpenses),
        items: financeData.insuranceExpenses,
      },
      {
        category: "Miscellaneous",
        amount: sumAmount(financeData.miscellaneousExpenses),
        items: financeData.miscellaneousExpenses,
      },
    ];
  }, [financeData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const items = data.items || [];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.category}
          </p>
          <p className="text-green-500 font-bold">
            ₹{data.amount.toLocaleString()}
          </p>
          <div className="mt-2 space-y-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
              >
                <span>{item.name || "No Category"}</span>
                <span>₹{Number(item.amount || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!financeData)
    return <p className="text-gray-500">No expense data found.</p>;

  return (
    <div className="bg-white dark:bg-[#121111] p-2 rounded-2xl shadow-lg w-full h-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white ml-4">
        Expenses Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          {/* Gradient for modern look */}
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2} />
            </linearGradient>
          </defs>

<CartesianGrid
              strokeDasharray="4 4"
              stroke="#bdbdbd"
              strokeOpacity={0.3}
            />            <XAxis
            dataKey="category"
            interval={0}
            tick={{ fill: "#6b7280", fontSize: 14 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#6b7280", fontSize: 14 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4ade80"
            fill="url(#colorAmount)"
            strokeWidth={3}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: "#16a34a",
              fill: "#4ade80",
            }} // Dots at data points
            dot={{ r: 4, fill: "#16a34a", stroke: "#ffffff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
