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
import Footer from "../Footer";

export default function SIPCalculator() {
  const [method, setMethod] = useState("normal"); // Normal or Step-Up
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [stepUp, setStepUp] = useState(""); // step-up percentage
  const [maturity, setMaturity] = useState(null);
  const [invested, setInvested] = useState(null);
  const [returns, setReturns] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateSIP = () => {
    const P = Number(monthlyInvestment);
    const r = Number(rate) / 100; // annual rate
    const t = Number(tenure);
    const step = Number(stepUp) / 100;

    const n = t * 12; // total months
    const i = Math.pow(1 + r, 1 / 12) - 1; // effective monthly rate

    let totalInvested = 0;
    let totalValue = 0; // cumulative maturity value
    let currentInvestment = P;
    let data = [];

    for (let month = 1; month <= n; month++) {
      // Apply step-up at start of year
      if (method === "step-up" && month > 1 && (month - 1) % 12 === 0) {
        currentInvestment *= 1 + step;
      }

      totalInvested += currentInvestment;
      totalValue = totalValue * (1 + i) + currentInvestment; // cumulative compound

      data.push({
        month,
        Invested: totalInvested,
        Maturity: Math.round(totalValue),
      });
    }

    // Final maturity using step-up formula
    let M = 0;
    currentInvestment = P;
    for (let month = 1; month <= n; month++) {
      M += currentInvestment * Math.pow(1 + i, n - month);
      if (method === "step-up" && month % 12 === 0) {
        currentInvestment *= 1 + step;
      }
    }
    M *= 1 + i;

    setMaturity(Math.round(M));
    setInvested(Math.round(totalInvested));
    setReturns(Math.round(M - totalInvested));
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
            SIP Calculator
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your SIP maturity amount using normal or step-up
            investment method.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Chart */}
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
                  />{" "}
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Months",
                      position: "insideBottom",
                      offset: -10,
                    }}
                    interval={Math.floor(chartData.length / 12)}
                  />
                  <YAxis
                    label={{
                      value: "Amount (₹)",
                      angle: -90,
                      position: "insideLeft",
                      offset: 0,
                    }}
                    tickFormatter={(value) =>
                      value >= 100000 ? `${value / 100000}L` : value
                    }
                  />
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    labelFormatter={(label) => `Month - ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="Maturity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Invested"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Enter values and click calculate to see the chart.
              </p>
            )}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-black rounded-2xl p-8 shadow-xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="step-up">Step-Up</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Monthly SIP Amount (₹)
                </label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Expected Annual Return (%)
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
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                />
              </div>

              {method === "step-up" && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Step-Up (%)
                  </label>
                  <input
                    type="number"
                    value={stepUp}
                    onChange={(e) => setStepUp(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              onClick={calculateSIP}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Calculate
            </button>

            {maturity && (
              <div className="text-center mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg space-y-2">
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
      <Footer></Footer>
    </>
  );
}
