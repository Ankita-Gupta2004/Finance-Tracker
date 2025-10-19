// AssetsReport.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import CryptoJS from "crypto-js";
import { useAuth } from "../../context/AuthContext";

export default function AssetsReport() {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const { user, loading } = useAuth();
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    if (!user) return;

    const storageKey = `assetsData_${user.uid}`;
    const encrypted = localStorage.getItem(storageKey);
    let savedAssets = [];

    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        savedAssets = JSON.parse(decrypted) || [];
      } catch (err) {
        console.error("Failed to decrypt assets:", err);
        savedAssets = [];
      }
    }

    setAssets(savedAssets);

    const totalVal = savedAssets.reduce(
      (sum, a) => sum + Number(a.value || 0),
      0
    );
    setTotal(totalVal);
  }, [user]);

  const dataWithPercent = assets.map((a) => ({
    ...a,
    value: Number(a.value) || 0,
    percentage: total ? ((Number(a.value || 0) / total) * 100).toFixed(2) : 0,
  }));

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#14B8A6",
    "#F43F5E",
    "#22C55E",
    "#EAB308",
    "#0EA5E9",
  ];

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!user)
    return (
      <p className="text-center py-6">Please log in to view your assets.</p>
    );

  return (
    <>
      <section className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/30 to-teal-400 rounded-full opacity-20 blur-3xl"
              animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-tr from-teal-400/40 to-emerald-400 rounded-full opacity-20 blur-3xl"
              animate={{
                y: [0, 20, 0],
                x: [0, -20, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mt-10">
              Report & Insights
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              A summary of your total assets, their distribution, and insights
              into your portfolio.
            </p>
          </motion.div>

          {/* Total Assets */}
          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-14">
              Assets Report
            </h2>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Total Assets Value: ₹ {total.toLocaleString()}
            </h2>
          </div>

          {/* Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Assets Breakdown
              </h2>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                    Asset Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                    Value (₹)
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                    Contribution (%)
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataWithPercent.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-600 dark:text-gray-400"
                    >
                      No assets found. Please add some in the Assets page.
                    </td>
                  </tr>
                ) : (
                  dataWithPercent.map((a, idx) => (
                    <tr
                      key={a.id}
                      className={`${
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-900/30"
                          : "bg-gray-100 dark:bg-gray-800/50"
                      } hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition`}
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        {a.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {a.type}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        ₹ {Number(a.value || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {a.percentage}%
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {a.note || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Pie Chart Section */}
          {dataWithPercent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-8 mt-10"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <PieIcon className="text-emerald-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Assets Distribution
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                {/* Pie Chart */}
                <div className="h-80 w-full lg:w-1/2">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={dataWithPercent}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // donut style
                        outerRadius={120}
                        paddingAngle={4} // space between slices
                        label={({ name, percentage }) => `${percentage}%`}
                        labelLine={false}
                        isAnimationActive
                        animationDuration={1200}
                      >
                        {dataWithPercent.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          `₹ ${value.toLocaleString()}`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: document.body.classList.contains(
                            "dark"
                          )
                            ? "rgba(17, 25, 40, 0.9)" // dark mode
                            : "#ffffff", // light mode
                          color: document.body.classList.contains("dark")
                            ? "#ffffff"
                            : "#111827",
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: document.body.classList.contains("dark")
                            ? "0 2px 12px rgba(0,0,0,0.5)"
                            : "0 2px 12px rgba(0,0,0,0.1)",
                          padding: "8px 12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Modern Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-1/2">
                  {dataWithPercent.map((a, index) => (
                    <motion.div
                      key={a.id}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {a.name || "Unnamed"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {a.type}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-500">
                          ₹ {Number(a.value || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {a.percentage}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
