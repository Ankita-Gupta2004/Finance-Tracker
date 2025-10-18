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
import { useAuth } from "../../context/AuthContext";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function LoansDebtStackedChart() {
  const { user, loading } = useAuth();
  const [loansData, setLoansData] = useState([]);

  // Show loading while Firebase checks user
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your loans chart.</p>;

  // Load per-user encrypted data
  useEffect(() => {
    const savedData = localStorage.getItem(`loansData_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setLoansData(decrypted);
      } catch (err) {
        console.error("Failed to decrypt loans data", err);
      }
    }
  }, [user]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!loansData || loansData.length === 0) return [];

    const types = ["Personal", "Home", "Vehicle", "Education", "Other"];

    return types.map((type) => {
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
  }, [loansData]);

  // Custom tooltip showing lender details
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

  if (!loansData || loansData.length === 0)
    return <p className="text-gray-500">No loan data found.</p>;

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
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#bdbdbd" strokeOpacity={0.3} />
          <XAxis dataKey="type" tick={{ fill: "#6b7280", fontSize: 14 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 14 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
