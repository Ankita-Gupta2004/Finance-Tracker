import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
import { useAuth } from "../../context/AuthContext";

export default function FinanceHealthCard() {
  const [healthScore, setHealthScore] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    if (!user) return;

    // ---------- Load Assets ----------
    let assetsData = [];
    try {
      const encrypted = localStorage.getItem(`assetsData_${user.uid}`);
      if (encrypted) {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        assetsData = JSON.parse(decrypted) || [];
      }
    } catch (err) {
      console.error("Asset decryption failed:", err);
    }
    const totalAssets = assetsData.reduce(
      (sum, a) => sum + Number(a.value || 0),
      0
    );

    // ---------- Load Finance Data ----------
    let financeData = {};
    let totalExpense = 0;
    try {
      const encryptedFinanceData = localStorage.getItem(
        `financeData_${user.uid}`
      );
      if (encryptedFinanceData) {
        const bytes = CryptoJS.AES.decrypt(encryptedFinanceData, SECRET_KEY);
        const decryptedFinanceData = bytes.toString(CryptoJS.enc.Utf8);
        financeData = JSON.parse(decryptedFinanceData) || {};

        const allExpenses = [
          ...(financeData.essentialExpenses || []),
          ...(financeData.discretionaryExpenses || []),
          ...(financeData.debts || []),
          ...(financeData.educationExpenses || []),
          ...(financeData.familyExpenses || []),
          ...(financeData.insuranceExpenses || []),
          ...(financeData.miscellaneousExpenses || []),
        ];

        totalExpense = allExpenses.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        );
      }
    } catch (err) {
      console.error("Error decrypting finance data:", err);
    }

    // ---------- Load Investments ----------
    let investments = [];
    let totalInvestments = 0;
    try {
      const savedInvestments = localStorage.getItem(
        `investmentData_${user.uid}`
      );
      if (savedInvestments) {
        const bytes = CryptoJS.AES.decrypt(savedInvestments, SECRET_KEY);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) || {};
        investments = [
          ...(data.stocks || []),
          ...(data.mfs || []),
          ...(data.fds || []),
          ...(data.cryptos || []),
          ...(data.goldEtfs || []),
          ...(data.reits || []),
          ...(data.debtFunds || []),
        ];
        totalInvestments = investments.reduce(
          (sum, i) => sum + Number(i.amount || 0),
          0
        );
      }
    } catch (err) {
      console.error("Failed to load investments:", err);
    }

    // ---------- Load Loans ----------
    let loansData = [];
    let totalLoans = 0;
    try {
      const savedLoans = localStorage.getItem(`loansData_${user.uid}`);
      if (savedLoans) {
        const bytes = CryptoJS.AES.decrypt(savedLoans, SECRET_KEY);
        loansData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) || [];
        totalLoans = loansData.reduce((sum, l) => {
          const amount = parseFloat(l.amount) || 0;
          const paid = parseFloat(l.paid) || 0;
          return sum + (amount - paid);
        }, 0);
      }
    } catch (err) {
      console.error("Failed to load loans data:", err);
    }

    // ---------- Load Insurance ----------
    let insurancesData = [];
    let totalPremiums = 0;
    try {
      const savedInsurances = localStorage.getItem(
        `insurancesData_${user.uid}`
      );
      if (savedInsurances) {
        const bytes = CryptoJS.AES.decrypt(savedInsurances, SECRET_KEY);
        insurancesData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) || [];
        totalPremiums = insurancesData.reduce(
          (sum, i) => sum + (parseFloat(i.premium) || 0),
          0
        );
      }
    } catch (err) {
      console.error("Failed to load insurance data:", err);
    }

    // ---------- Load Goals ----------
    let allGoals = [];
    let goalCompletion = 0;
    try {
      const savedGoals = localStorage.getItem(`goalsData_${user.uid}`);
      if (savedGoals) {
        const bytes = CryptoJS.AES.decrypt(savedGoals, SECRET_KEY + user.uid);
        const goalsData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) || {};
        const shortTermGoals = goalsData.shortTermGoals || [];
        const midTermGoals = goalsData.midTermGoals || [];
        const longTermGoals = goalsData.longTermGoals || [];

        allGoals = [...shortTermGoals, ...midTermGoals, ...longTermGoals];

        // ✅ Only valid goals with targetAmount > 0
        const validGoals = allGoals.filter(
          (g) => parseFloat(g.targetAmount) > 0
        );

        if (validGoals.length > 0) {
          goalCompletion =
            validGoals.reduce((sum, g) => {
              const curr = parseFloat(g.currentSavings) || 0;
              const target = parseFloat(g.targetAmount) || 0;
              return sum + Math.min((curr / target) * 100, 100);
            }, 0) / validGoals.length;

          goalCompletion = Math.round(goalCompletion); // ✅ Round to nearest integer
        }
      }
    } catch (err) {
      console.error("Failed to load goals data:", err);
    }

    // ---------- Health Score Formula ----------
    let score = 0;
    if (totalAssets > 0) {
      score += Math.min(((totalAssets - totalExpense) / totalAssets) * 40, 40);
    }
    score += Math.min(goalCompletion * 0.25, 25);
    score += Math.min((totalInvestments / (totalAssets || 1)) * 15, 15);
    score -= Math.min((totalLoans / (totalAssets || 1)) * 20, 20);
    score -= Math.min((totalPremiums / (totalAssets || 1)) * 5, 5);

    score = Math.max(0, Math.min(100, score));

    setHealthScore(score);

    // ---------- Alerts ----------
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
  }, [user]);

  // ---------- UI ----------
  return (
    <div className="h-full bg-white dark:bg-[#121111] rounded-xl p-0 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Finance Health
        </h2>

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
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="30%" stopColor="#f97316" />
                  <stop offset="60%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#22c55e" />
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
                animate={{ strokeDashoffset: 345 - (345 * healthScore) / 100 }}
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
