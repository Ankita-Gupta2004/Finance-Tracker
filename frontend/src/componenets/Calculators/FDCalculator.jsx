import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [frequency, setFrequency] = useState("yearly");
  const [maturity, setMaturity] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateFD = () => {
    if (!principal || !rate || !tenure) return;

    const P = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(tenure);
    const n = frequency === "quarterly" ? 4 : frequency === "monthly" ? 12 : 1;

    const M = P * Math.pow(1 + r / n, n * t);
    setMaturity(M);

    const data = [];
    if (t <= 1) {
      // monthly points
      const totalMonths = Math.ceil(t * 12);
      for (let i = 0; i <= totalMonths; i++) {
        const currentTime = i / 12; // fraction of year
        const periods = n * currentTime;
        const amount = P * Math.pow(1 + r / n, periods);
        data.push({
          year: `Month ${i}`,
          Maturity: Math.round(amount),
        });
      }
    } else {
      // yearly points
      const totalYears = Math.ceil(t);
      for (let i = 0; i <= totalYears; i++) {
        const periods = n * i;
        const amount = P * Math.pow(1 + r / n, periods);
        data.push({
          year: `Year ${i}`,
          Maturity: Math.round(amount),
        });
      }
    }

    setChartData(data);
  };

  // derive chart max for axis scaling and format decisions
  const maxChartValue = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    return Math.max(...chartData.map((d) => Number(d.Maturity) || 0));
  }, [chartData]);

  // Y axis tick formatter based on magnitude
  const formatYAxisTick = (val) => {
    if (maxChartValue >= 100000) return (val / 100000).toFixed(1) + "L";
    if (maxChartValue >= 1000) return (val / 1000).toFixed(0) + "K";
    return val;
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-100 dark:bg-[#121212] py-32 px-4 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Fixed Deposit Calculator
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your FD maturity amount and visualize your growth over
            time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Chart Column */}
          <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-xl">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-center">
              FD Growth Over Time
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />

                  <XAxis
                    dataKey="year"
                    type="category"
                    interval={chartData.length <= 12 ? 0 : "preserveStartEnd"}
                    tick={{ fontSize: 12 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                    label={{
                      value: Number(tenure) <= 1 ? "Months" : "Years",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />

                  <YAxis
                    domain={[0, Math.ceil(maxChartValue * 1.05) || "dataMax"]}
                    tickCount={6}
                    tickFormatter={formatYAxisTick}
                    label={{
                      value: "Amount (₹)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 0,
                    }}
                    width={80}
                  />

                  <Tooltip
                    formatter={(value) => `₹${Number(value).toLocaleString()}`}
                    labelFormatter={(label) => label}
                  />
                  <Line
                    type="monotone"
                    dataKey="Maturity"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={chartData.length <= 12}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-20">
                Enter values and click calculate to see the chart.
              </p>
            )}
          </div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-black rounded-2xl p-8 shadow-xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Principal Amount (₹)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Compounding Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                >
                  <option value="yearly">Yearly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateFD}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Calculate
            </button>

            {maturity && (
              <div className="text-center mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg">
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  Maturity Amount: ₹{parseFloat(maturity).toLocaleString()}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
