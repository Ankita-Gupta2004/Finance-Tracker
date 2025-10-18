// LoansDebtStackedChart.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LoansDebtStackedChart() {
  const [loansData, setLoansData] = useState([]);

  // Load loans from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("loansData");
    if (savedData) setLoansData(JSON.parse(savedData));
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!loansData || loansData.length === 0) return [];

    const types = ["Personal", "Home", "Vehicle", "Education", "Other"];

    // Group amounts by type
    const data = types.map((type) => {
      const filtered = loansData.filter((loan) => loan.type === type);
      const totalAmount = filtered.reduce(
        (sum, l) => sum + Number(l.amount || 0),
        0
      );
      return {
        type,
        amount: totalAmount,
        details: filtered, // for tooltip
      };
    });

    return data;
  }, [loansData]);

  if (!loansData || loansData.length === 0)
    return <p className="text-gray-500">No loan data found.</p>;

  // Custom tooltip to show lender & amount
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const loanDetails = payload[0].payload.details;
      return (
        <div className="bg-white dark:bg-gray-800 border p-3 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {loanDetails.map((l) => (
            <p key={l.id} className="text-sm">
              {l.lender}: ₹{Number(l.amount).toLocaleString()} | EMI: ₹
              {Number(l.emi).toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#121111] rounded-xl shadow-lg flex flex-col items-center justify-center p-6 w-full h-[350px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Loans & Debt Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.4} />
            </linearGradient>
          </defs>

<CartesianGrid
              strokeDasharray="4 4"
              stroke="#bdbdbd"
              strokeOpacity={0.3}
            />            <XAxis dataKey="type" tick={{ fill: "#6b7280", fontSize: 14 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 14 }} />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="amount"
            fill="url(#barGradient)"
            radius={[10, 10, 0, 0]}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
