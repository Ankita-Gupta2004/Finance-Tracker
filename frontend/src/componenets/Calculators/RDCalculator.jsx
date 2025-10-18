import { useState } from "react";
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

export default function RDCalculator() {
  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [maturity, setMaturity] = useState(null);
  const [invested, setInvested] = useState(null);
  const [returns, setReturns] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateRD = () => {
    const R = Number(monthlyInstallment);
    const r = Number(rate) / 100;
    const t = Number(tenure);

    const n = t * 4; // number of quarters
    const i = r / 4; // quarterly interest in decimal

    const M = R * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)));

    const investedAmount = R * 12 * t;
    const interestEarned = M - investedAmount;

    setMaturity(Math.round(M));
    setInvested(Math.round(investedAmount));
    setReturns(Math.round(interestEarned));

    // Chart data
    let data = [];
    let total = 0;
    for (let month = 1; month <= t * 12; month++) {
      total += R;
      const quarter = Math.floor((month - 1) / 3);
      const matured =
        R *
        ((Math.pow(1 + i, quarter + 1) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
      data.push({
        month,
        Invested: total,
        Maturity: Math.round(matured),
      });
    }
    setChartData(data);
  };

  return (
    <>
    <Navbar></Navbar>
    <section className="min-h-screen bg-gray-100 dark:bg-[#121212] py-32 px-4 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Recurring Deposit Calculator
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Calculate your RD maturity amount with quarterly compounding and
          visualize your growth over time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Chart Column */}
          <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-xl">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-center">
              Investment Growth Over Time
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
            data={chartData}
            margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#bdbdbd"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="month"
              label={{
                value: "Months",
                position: "insideBottom",
                offset: -10,
              }}
              interval={Math.floor(chartData.length / 12)} // show ~12 ticks evenly
                />
                <YAxis
                  label={{
                    value: "Amount (₹)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                  tickFormatter={(value) => {
                    if (value >= 100000) return `${value / 100000}L`;
                    return value.toLocaleString();
                  }}
                />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  labelFormatter={(label) => `Month ${label}`}
                />
                {/* Invested Amount Line - Dashed */}
                <Line
                  type="monotone" // smooth curve
                  dataKey="Maturity"
                  stroke="#3B82F6" // solid color
                  strokeWidth={2} // thickness
                  dot={false} // remove point markers
                  activeDot={false} // remove hover dot
                />
                <Line
                  type="monotone"
                  dataKey="Invested"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  strokeDasharray="5 5" // optional dashed line for comparison
                />

                {/* Maturity Amount Line - Solid Gradient */}

                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#9333EA" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
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
                Monthly Installment (₹)
              </label>
              <input
                type="number"
                value={monthlyInstallment}
                onChange={(e) => setMonthlyInstallment(e.target.value)}
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
          </div>

          <button
            onClick={calculateRD}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Calculate
          </button>

          {maturity && (
            <div className="text-center mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300  rounded-lg space-y-2">
              <p className="text-gray-900 dark:text-white font-semibold text-lg">
                Maturity Amount: ₹{maturity.toLocaleString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Invested Amount: ₹{invested.toLocaleString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Estimated Returns: ₹{returns.toLocaleString()}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
    </>
  );
}
