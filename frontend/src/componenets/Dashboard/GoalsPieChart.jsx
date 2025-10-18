import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS_LIGHT = ["#10B981", "#3B82F6", "#F59E0B"];
const COLORS_DARK = ["#22C55E", "#3B82F6", "#EC4899"];

const GoalsPieChart = ({ shortTermGoals, midTermGoals, longTermGoals }) => {
  const [isDark, setIsDark] = useState(false);

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
            startAngle={90} // rotate start position
            endAngle={450} // complete circle anticlockwise
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
};

export default GoalsPieChart;
