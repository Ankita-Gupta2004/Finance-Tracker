// GoalsProgressCard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GoalsProgressCard() {
  const [goalsData, setGoalsData] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("goalsData");
    if (savedData) {
      const data = JSON.parse(savedData);
      const allGoals = [
        ...data.shortTermGoals.map((g) => ({ ...g, type: "Short-term" })),
        ...data.midTermGoals.map((g) => ({ ...g, type: "Mid-term" })),
        ...data.longTermGoals.map((g) => ({ ...g, type: "Long-term" })),
      ];
      setGoalsData(allGoals);
    }
  }, []);

  const getProgress = (goal) => {
    const target = Number(goal.targetAmount) || 1;
    const current = Number(goal.currentSavings) || 0;
    return Math.min((current / target) * 100, 100).toFixed(0);
  };

  const typeColors = {
    "Short-term": "bg-emerald-500",
    "Mid-term": "bg-blue-500",
    "Long-term": "bg-pink-500",
  };

  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Goals Progress
      </h2>

      {/* Legends */}
      <div className="flex items-center gap-6 mb-4 border-b border-b-gray-300 dark:border-b-gray-600 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Short-term
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Mid-term
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink-500"></span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Long-term
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto pr-2">
        {goalsData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No goals saved yet.
          </p>
        ) : (
          goalsData.map((goal) => {
            const progress = getProgress(goal);
            return (
              <div key={goal.id} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {goal.goal || "Untitled Goal"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-black rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className={`${typeColors[goal.type]} h-4 rounded-full`}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {goal.type} | Target: ₹{goal.targetAmount || 0} | Current: ₹
                  {goal.currentSavings || 0}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
