// GoalsPieChart.jsx
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CryptoJS from "crypto-js";
import { useAuth } from "../../context/AuthContext"; // adjust path

const COLORS_LIGHT = ["#10B981", "#3B82F6", "#F59E0B"];
const COLORS_DARK = ["#22C55E", "#3B82F6", "#EC4899"];

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function GoalsPieChart() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [shortTermGoals, setShortTermGoals] = useState([]);
  const [midTermGoals, setMidTermGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);

  // Detect dark mode
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);

    const listener = (e) => setIsDark(e.matches);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
  }, []);

  // Load encrypted goals from localStorage
  useEffect(() => {
    if (!user?.uid) return;

    const savedData = localStorage.getItem(`goalsData_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY + user.uid);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setShortTermGoals(decrypted.shortTermGoals || []);
        setMidTermGoals(decrypted.midTermGoals || []);
        setLongTermGoals(decrypted.longTermGoals || []);
      } catch (err) {
        console.error("Failed to decrypt goals data:", err);
      }
    }
  }, [user?.uid]);

  // Aggregate goal amounts
  const chartData = [
    {
      name: "Short-term",
      value: shortTermGoals.reduce(
        (sum, g) => sum + Number(g.targetAmount || 0),
        0
      ),
    },
    {
      name: "Mid-term",
      value: midTermGoals.reduce(
        (sum, g) => sum + Number(g.targetAmount || 0),
        0
      ),
    },
    {
      name: "Long-term",
      value: longTermGoals.reduce(
        (sum, g) => sum + Number(g.targetAmount || 0),
        0
      ),
    },
  ];

  if (loading) return <p className="text-gray-500">Loading goals...</p>;
  if (!user) return <p className="text-gray-500">Please log in to view goals chart.</p>;

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={3}
            cornerRadius={8}
            startAngle={0}
            endAngle={730}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  isDark
                    ? COLORS_DARK[index % COLORS_DARK.length]
                    : COLORS_LIGHT[index % COLORS_LIGHT.length]
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value}`}
            contentStyle={{
              backgroundColor: isDark ? "#111827" : "#fff",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            itemStyle={{ color: isDark ? "#D1D5DB" : "#374151" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
