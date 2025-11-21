import React, { useEffect, useState } from "react";

import Navbar from "../Navbar";
import Footer from "../Footer";
import InvestmentPanel from "./InvestmentPanel";
import GoalsPieChart from "./GoalsPieChart";
import ExpensesLineChart from "./ExpensesLineChart";
import LoansDebtStackedChart from "./LoansDebtStackedChart";
import InsuranceDonutCard from "./InsuranceDonutCard";
import GoalsProgressCard from "./GoalsProgressCard";
import AssetsDashboard from "./AssetsDashboard";
import FinanceHealthCard from "./FinanceHealthCard";
import AccountPanelBottom from "./AccountPanelBottom";

// const COLORS = ["#6366F1", "#F59E42", "#22C55E", "#E11D48", "#06B6D4"];

// Helper to get data from localStorage
// const getLocalData = (key, fallback = {}) => {
//   try {
//     return JSON.parse(localStorage.getItem(key)) || fallback;
//   } catch {
//     return fallback;
//   }
// };

export default function Dashboard() {
  const [account, setAccount] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState({});

  useEffect(() => {
    // Helper to safely get data from localStorage
    const getLocalData = (key, fallback = {}) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
      } catch {
        return fallback;
      }
    };

    // 1 Get account data
    const accountData = getLocalData("account", {
      name: "Guest User",
      email: "guest@example.com",
      avatar: "",
      totalIncome: 0,
    });

    // 2 Get finance form data
    const financeData = getLocalData("financeData", {});

    // Helper to sum amounts in an array
    const sumAmounts = (arr) =>
      (arr || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // 3 Calculate totals
    const totalIncome = financeData.totalIncome || accountData.totalIncome || 0;
    const totalEssential = sumAmounts(financeData.essentialExpenses);
    const totalDiscretionary = sumAmounts(financeData.discretionaryExpenses);
    const totalDebts = sumAmounts(financeData.debts);
    const totalEducation = sumAmounts(financeData.educationExpenses);
    const totalFamily = sumAmounts(financeData.familyExpenses);
    const totalInsurance = sumAmounts(financeData.insuranceExpenses);
    const totalMisc = sumAmounts(financeData.miscellaneousExpenses);
    const totalInvestments = sumAmounts(financeData.investments);

    const totalExpense =
      totalEssential +
      totalDiscretionary +
      totalDebts +
      totalEducation +
      totalFamily +
      totalInsurance +
      totalMisc +
      totalInvestments;

    const savings = totalIncome - totalExpense;

    // 4 Get last modified
    const lastModified =
      localStorage.getItem("lastModified") || new Date().toISOString();

    // 5 Set account state
    setAccount({
      ...accountData,
      totalIncome,
      totalExpense,
      savings,
      lastModified,
    });

    // 6 Prepare expenses for charts
    const allExpenses = [
      ...(financeData.essentialExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.discretionaryExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.educationExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.familyExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.insuranceExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.miscellaneousExpenses || []).map((e) => ({
        ...e,
        category: e.name,
      })),
      ...(financeData.investments || []).map((e) => ({
        ...e,
        category: e.name,
      })),
    ];
    setExpenses(allExpenses);

    // 7 Load goals if any
    setGoals(getLocalData("goals", {}));
  }, []);

  const savings = account.totalIncome - account.totalExpense;
  const essentialBudget = 80000;
  const essentialSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const essentialPercent = Math.round((essentialSpent / essentialBudget) * 100);

  const alerts = [];
  if (essentialPercent > 80)
    alerts.push("You’ve spent 80% of your essential budget this month");
  if (goals.sip && goals.sip < 6000)
    alerts.push("You are behind on your SIP savings goal");

  const [shortTermGoals, setShortTermGoals] = useState([]);
  const [midTermGoals, setMidTermGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("goalsData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setShortTermGoals(data.shortTermGoals || []);
      setMidTermGoals(data.midTermGoals || []);
      setLongTermGoals(data.longTermGoals || []);
    }
  }, []);

  return (
    <>
      <Navbar></Navbar>

      <div className="min-h-screen bg-white dark:bg-[#0b0909f5] flex items-center justify-center">
        <div className="bg-white dark:bg-[#171d1f00] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-[1700px] w-full m-8 mt-24">
          <div
            className="
    grid gap-4
    grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_1.2fr]
    auto-rows-min
  "
          >
            {/* 1. Account Panel (styled — layout row/col preserved) */}
            <div
              className="
    row-span-3 col-span-1
    rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl
    bg-gradient-to-br from-emerald-600 to-teal-800
    dark:from-[#06392d] dark:to-[#000000]
    text-white
  "
            >
              {/* Avatar & Name */}
              <div className="flex flex-col items-center w-full">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center mb-4 bg-white/30 dark:bg-[#0b1113]/30 dark:border-gray-600 text-6xl">
                  {account.avatar ? (
                    <img
                      src={account.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-1 text-center">
                  {account.name}
                </h2>
                <p className="text-white/80 dark:text-gray-300 text-sm text-center">
                  {account.email}
                </p>
              </div>

              <hr className="w-full border-white/30 my-4 dark:border-gray-600" />

              {/* Stats Section */}
              <div className="w-full grid grid-cols-1 gap-3">
                <div className="bg-white/20 dark:bg-gray-700/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 dark:text-gray-300 text-sm font-medium">
                      Total Income
                    </span>
                  </div>
                  <span className="font-semibold text-white dark:text-teal-200">
                    ₹{account.totalIncome}
                  </span>
                </div>
                <div className="bg-white/20 dark:bg-gray-700/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 dark:text-gray-300 text-sm font-medium">
                      Total Expense
                    </span>
                  </div>
                  <span className="font-semibold text-white dark:text-emerald-200">
                    ₹{account.totalExpense}
                  </span>
                </div>
                <div className="bg-white/20 dark:bg-gray-700/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 dark:text-gray-300 text-sm font-medium">
                      Savings
                    </span>
                  </div>
                  <span className="font-semibold text-white dark:text-teal-100">
                    ₹{savings}
                  </span>
                </div>
              </div>

              <hr className="w-full border-white/30 my-4 dark:border-gray-600" />

              {/* Budget / Progress Section */}
              <div className="w-full flex flex-col items-center gap-2">
                {account.budget ? (
                  <p className="text-white/80 dark:text-gray-300 text-sm text-center">
                    Monthly Budget:{" "}
                    <span className="font-medium">
                      ₹{Number(account.budget).toLocaleString()}
                    </span>
                    {" · Spent: "}
                    <span className="font-medium">
                      ₹{Number(account.totalExpense || 0).toLocaleString()}
                    </span>
                    {" · "}
                    <span className="font-semibold">
                      {Math.min(
                        100,
                        ((account.totalExpense || 0) / (account.budget || 1)) *
                          100
                      ).toFixed(1)}
                      %
                    </span>
                  </p>
                ) : (
                  <p className="text-white/80 dark:text-gray-300 text-sm text-center">
                    No monthly budget set — you have spent{" "}
                    <span className="font-medium">
                      ₹{Number(account.totalExpense || 0).toLocaleString()}
                    </span>{" "}
                    (
                    {Math.min(
                      100,
                      ((account.totalExpense || 0) /
                        (account.totalIncome || 1)) *
                        100
                    ).toFixed(1)}
                    % of income)
                  </p>
                )}

                <div className="w-full bg-white/20 dark:bg-gray-700/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 dark:bg-teal-800 transition-all"
                    style={{
                      width: `${
                        account.budget
                          ? Math.min(
                              100,
                              ((account.totalExpense || 0) /
                                (account.budget || 1)) *
                                100
                            ).toFixed(1)
                          : Math.min(
                              100,
                              ((account.totalExpense || 0) /
                                (account.totalIncome || 1)) *
                                100
                            ).toFixed(1)
                      }%`,
                    }}
                  />
                </div>
              </div>
              <hr className="w-full border-white/30 my-4 dark:border-gray-600" />

              {/* Month & Last Modified */}
              <AccountPanelBottom></AccountPanelBottom>
            </div>

            {/* 2. Pie Chart (Income/Expense/Savings) */}
            <div className="row-span-1 col-span-2 bg-white dark:bg-[#121111] border border-gray-300 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
              <h1 className="font-semibold mb-4 text-xl md:text-2xl text-black dark:text-white">
                Goals
              </h1>

              <GoalsPieChart
                shortTermGoals={shortTermGoals}
                midTermGoals={midTermGoals}
                longTermGoals={longTermGoals}
              />
            </div>

            {/* 3. Investment Panel*/}
            <div className="row-span-1 col-span-3 bg-white dark:bg-[#121111] border border-gray-300 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center shadow-lg">
              <h1 className="font-semibold mb-4 text-xl md:text-2xl text-black dark:text-white">
                Investments
              </h1>
              <InvestmentPanel></InvestmentPanel>
            </div>

            {/* 4. Expenses Chart (Bar) */}
            <div className="row-span-2 col-start-2 col-end-7 bg-white dark:bg-[#0c0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg h-96">
              <ExpensesLineChart />
            </div>

            {/* Full-width 3-column cards */}
            <div className="col-start-1 col-end-7 row-start-4 row-end-6 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#0c0a0a] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center shadow-lg p-6">
                <LoansDebtStackedChart />
              </div>

              <div className="bg-white dark:bg-[#0c0a0a] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center shadow-lg p-6">
                <InsuranceDonutCard></InsuranceDonutCard>
              </div>
            </div>

            <div className="row-span-1 col-start-1 col-end-3 bg-white dark:bg-[#121111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg h-96">
              <GoalsProgressCard></GoalsProgressCard>
            </div>
            <div className="row-span-1 col-start-3 col-end-5 bg-white dark:bg-[#121111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg h-96">
              <AssetsDashboard></AssetsDashboard>
            </div>

            <div className="row-span-1 col-start-5 col-end-7 bg-white dark:bg-[#121111] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-lg h-96">
              <FinanceHealthCard></FinanceHealthCard>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}
