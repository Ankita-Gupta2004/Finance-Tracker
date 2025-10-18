import { useState } from "react";
import { motion } from "framer-motion";
import { GiPiggyBank } from "react-icons/gi";
import { FaTree, FaUmbrellaBeach } from "react-icons/fa";

export default function FireSection() {
  const [currentAge, setCurrentAge] = useState(28);
  const [desiredFireAge, setDesiredFireAge] = useState(40);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflation, setInflation] = useState(7);

  const [leanFire, setLeanFire] = useState(null);
  const [yearsToFI, setYearsToFI] = useState(null);

  const calculateFire = () => {
    const yearsUntilFire = desiredFireAge - currentAge;
    const adjustedExpenses =
      monthlyExpenses * Math.pow(1 + inflation / 100, yearsUntilFire);
    const lean = adjustedExpenses * 12 * 25; // Lean FIRE 4% rule
    setLeanFire(lean);
    setYearsToFI(yearsUntilFire);
  };

  const fireTypes = [
    {
      title: "Lean FIRE",
      description:
        "Achieve financial independence with minimal expenses. Live frugally and retire with a smaller corpus.",
      icon: <GiPiggyBank className="text-emerald-500" size={36} />,
    },
    {
      title: "Coast FIRE",
      description:
        "Save aggressively early so investments grow passively. Work part-time or leisurely until retirement.",
      icon: <FaTree className="text-emerald-500" size={36} />,
    },
    {
      title: "Fat FIRE",
      description:
        "Retire comfortably with higher expenses and luxuries. Requires a larger retirement corpus.",
      icon: <FaUmbrellaBeach className="text-emerald-500" size={36} />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-t from-gray-100 to-gray-50 dark:from-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Know Your
            <br />
            <span className="text-emerald-700">FIRE Number</span>
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Calculate how much you need to retire early and plan your journey to
            financial independence. Follow the steps below to use the calculator
            effectively.
          </p>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Steps to Use the Calculator
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-full font-semibold">
                  1
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Enter your current age and monthly expenses.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-full font-semibold">
                  2
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Set your desired FIRE age and inflation rate.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-full font-semibold">
                  3
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Click "Calculate" to get your estimated Lean FIRE number.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Calculator Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            FIRE Calculator (₹)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Current Age
              </label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Desired FIRE Age
              </label>
              <input
                type="number"
                value={desiredFireAge}
                onChange={(e) => setDesiredFireAge(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Monthly Expenses (₹)
              </label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={calculateFire}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mt-4 transition"
            >
              Calculate
            </button>
          </div>

          {/* Result */}
          {leanFire && (
            <div className="mt-6 bg-emerald-50 dark:bg-gray-700/30 rounded-xl p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                Your estimated <strong>Lean FIRE Number</strong> is:
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ₹{leanFire.toLocaleString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Estimated <strong>{yearsToFI} years</strong> to achieve FIRE
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Section: FIRE Type Cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 lg:px-8">
        {fireTypes.map((type, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition"
          >
            <div className="mb-4">{type.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {type.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {type.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
