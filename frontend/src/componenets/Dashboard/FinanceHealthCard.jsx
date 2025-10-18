import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function FinanceHealthCard() {
  const [healthScore, setHealthScore] = useState(0);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const safeParse = (key, fallback) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
      } catch {
        return fallback;
      }
    };

    const financeData = safeParse("financeData", {});
    const essentialExpenses = financeData.essentialExpenses || [];
    const discretionaryExpenses = financeData.discretionaryExpenses || [];
    const debts = financeData.debts || [];
    const educationExpenses = financeData.educationExpenses || [];
    const familyExpenses = financeData.familyExpenses || [];
    const insuranceExpenses = financeData.insuranceExpenses || [];
    const miscellaneousExpenses = financeData.miscellaneousExpenses || [];
    const investments = financeData.investments || [];
    const totalIncome = Number(financeData.totalIncome || 0);

    const allExpenses = [
      ...essentialExpenses,
      ...discretionaryExpenses,
      ...debts,
      ...educationExpenses,
      ...familyExpenses,
      ...insuranceExpenses,
      ...miscellaneousExpenses,
      ...investments,
    ];
    const totalExpense = allExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    const assetsData = safeParse("assetsData", []);
    const totalAssets = assetsData.reduce(
      (sum, a) => sum + Number(a.value || 0),
      0
    );

    const investmentData = safeParse("investmentData", {});
    const stocks = investmentData.stocks || [];
    const mfs = investmentData.mfs || [];
    const fds = investmentData.fds || [];
    const totalInvestments = [...stocks, ...mfs, ...fds].reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );

    const loansData = safeParse("loansData", []);
    const totalLoans = loansData.reduce(
      (sum, l) => sum + Number(l.amount || 0),
      0
    );

    const insurancesData = safeParse("insurancesData", []);
    const totalPremiums = insurancesData.reduce(
      (sum, i) => sum + Number(i.premium || 0),
      0
    );

    const goalsData = safeParse("goalsData", {});
    const shortTermGoals = goalsData.shortTermGoals || [];
    const midTermGoals = goalsData.midTermGoals || [];
    const longTermGoals = goalsData.longTermGoals || [];

    const allGoals = [...shortTermGoals, ...midTermGoals, ...longTermGoals];
    let goalCompletion = 0;
    if (allGoals.length > 0) {
      goalCompletion =
        allGoals.reduce((sum, g) => {
          const curr = Number(g.currentSavings || 0);
          const target = Number(g.targetAmount || 0);
          return sum + (target > 0 ? Math.min((curr / target) * 100, 100) : 0);
        }, 0) / allGoals.length;
    }

    let score = 0;
    if (totalAssets > 0) {
      score += Math.min(((totalAssets - totalExpense) / totalAssets) * 50, 50);
    }
    score += Math.min(goalCompletion * 0.3, 30);
    score += Math.min((totalInvestments / (totalAssets || 1)) * 10, 10);
    score -= Math.min((totalLoans / (totalAssets || 1)) * 10, 10);
    score += Math.min((totalPremiums / (totalAssets || 1)) * 10, 10);

    score = Math.max(0, Math.min(100, score));
    setHealthScore(score);

    const newAlerts = [];
    if (score < 30) {
      newAlerts.push({
        type: "danger",
        message:
          "Your financial health is poor. Consider reducing expenses or increasing assets.",
      });
    } else if (score < 60) {
      newAlerts.push({
        type: "warning",
        message:
          "Your financial health is moderate. Try to improve your savings, investments, and goal completion.",
      });
    } else {
      newAlerts.push({
        type: "good",
        message: "Great! Your financial health is strong.",
      });
    }
    if (goalCompletion < 50) {
      newAlerts.push({
        type: "warning",
        message: "Goal completion is below 50%. Review your goals progress.",
      });
    }
    if (totalLoans > totalAssets * 0.5) {
      newAlerts.push({
        type: "danger",
        message:
          "Your loans are more than half your assets. Consider reducing debt.",
      });
    }
    setAlerts(newAlerts);
  }, []);

  return (
    <div className="h-full bg-white dark:bg-[#121111] rounded-xl p-0 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Finance Health
        </h2>

        {/* Colorful Circular Chart */}
        <div className="flex justify-center mb-0">
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36">
              <defs>
                <linearGradient
                  id="healthGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
                  <stop offset="30%" stopColor="#f97316" /> {/* Orange */}
                  <stop offset="60%" stopColor="#facc15" /> {/* Yellow */}
                  <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
                </linearGradient>
              </defs>
              <circle
                className="text-gray-300 dark:text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="55"
                cx="72"
                cy="72"
              />
              <motion.circle
                initial={{ strokeDashoffset: 345 }}
                animate={{
                  strokeDashoffset: 345 - (345 * healthScore) / 100,
                }}
                transition={{ duration: 1 }}
                stroke="url(#healthGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="55"
                cx="72"
                cy="72"
                transform="rotate(-90 72 72)"
                strokeDasharray="345"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.round(healthScore)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Health Score
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {/* Alerts */}
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {alerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                alert.type === "danger"
                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                  : alert.type === "warning"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              }`}
            >
              {alert.type === "danger" && <AlertTriangle className="w-5 h-5" />}
              {alert.type === "warning" && <Info className="w-5 h-5" />}
              {alert.type === "good" && <CheckCircle className="w-5 h-5" />}
              <p className="text-sm">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
