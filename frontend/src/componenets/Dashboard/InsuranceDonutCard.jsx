// InsuranceDonutCard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  ClipboardCheck,

} from "lucide-react";

const COLORS = ["#4ade80", "#fbbf24", "#3b82f6", "#ef4444", "#a855f7"];

export default function InsuranceDonutCard() {
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("insurancesData");
    if (savedData) setInsurances(JSON.parse(savedData));
  }, []);

  const chartData = useMemo(() => {
    const grouped = {};
    insurances.forEach((i) => {
      const amt = Number(i.premium || 0);
      grouped[i.type] = (grouped[i.type] || 0) + amt;
    });
    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  }, [insurances]);

  const totalPremium = chartData.reduce((sum, i) => sum + i.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow border border-gray-200 dark:border-gray-700">
          <p className="font-semibold">{data.name}</p>
          <p className="text-green-500 font-bold">
            ₹{data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#121111] rounded-xl shadow-lg flex flex-col items-center justify-center p-6 w-full h-[350px]">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
        Insurance Overview
      </h3>

      {chartData.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mt-8">
          No insurance data available
        </p>
      ) : (
        <>
          {/* Total Premium + Policies Inline */}
          <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-lg">
            <ClipboardCheck
              size={20}
              className="text-emerald-500 dark:text-emerald-400"
            />
            <span>
              Total Premium: ₹{totalPremium.toLocaleString()} |{" "}
              {insurances.length}{" "}
              {insurances.length > 1 ? "Policies" : "Policy"}
            </span>
          </div>

          {/* Donut Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {chartData.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
