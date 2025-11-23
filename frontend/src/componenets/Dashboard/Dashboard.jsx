import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import CryptoJS from "crypto-js";
import { auth } from "../../firebase";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

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
    const parseRawFinance = (raw) => {
      if (!raw) return null;
      // try plain JSON
      try {
        return JSON.parse(raw);
      } catch {}
      // try decrypt then parse
      try {
        const dec = CryptoJS.AES.decrypt(raw, SECRET_KEY).toString(
          CryptoJS.enc.Utf8
        );
        return JSON.parse(dec);
      } catch (e) {
        console.warn("finance parse/decrypt failed", e);
        return null;
      }
    };

    const parseAmount = (v) => {
      if (v == null) return 0;
      if (typeof v === "number") return v;
      // remove currency symbols, commas, spaces
      const cleaned = String(v).replace(/[^\d.-]/g, "");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    };

    const normalizeGroups = (f) => {
      const groups = [
        "essentialExpenses",
        "discretionaryExpenses",
        "educationExpenses",
        "familyExpenses",
        "insuranceExpenses",
        "miscellaneousExpenses",
        "investments",
        "debts",
        "expenses",
        "otherIncome",
      ];
      const out = { ...f };
      groups.forEach((g) => {
        const arr = out[g] || [];
        out[g] = Array.isArray(arr)
          ? arr.map((it) => ({
              name: it?.name || it?.source || it?.category || "",
              amount: parseAmount(it?.amount ?? it),
            }))
          : [];
      });
      // ensure totalIncome field exists
      if (out.totalIncome == null) {
        const primary = parseAmount(out.primaryIncome);
        const otherSum = (out.otherIncome || []).reduce(
          (s, it) => s + parseAmount(it?.amount ?? it),
          0
        );
        out.totalIncome = primary + otherSum;
      } else {
        out.totalIncome = parseAmount(out.totalIncome);
      }
      return out;
    };

    const computeAndSet = (uid) => {
      const key = uid ? `financeData_${uid}` : "financeData";
      const raw = localStorage.getItem(key);
      console.log("[Dashboard] loading finance key:", key, "raw:", raw);
      const finance = normalizeGroups(parseRawFinance(raw) || {});
      // compute sums
      const sum = (arr) =>
        (arr || []).reduce((s, x) => s + parseAmount(x.amount), 0);
      const totalExpense =
        sum(finance.essentialExpenses) +
        sum(finance.discretionaryExpenses) +
        sum(finance.educationExpenses) +
        sum(finance.familyExpenses) +
        sum(finance.insuranceExpenses) +
        sum(finance.miscellaneousExpenses) +
        sum(finance.investments) +
        sum(finance.debts) +
        sum(finance.expenses);

      const totalIncome = parseAmount(finance.totalIncome || 0);
      const savings = totalIncome - totalExpense;
      console.log({ totalIncome, totalExpense, savings, finance });

      // account base from per-user account_{uid} or generic
      let accountData = {};
      try {
        const rawAcc = uid
          ? localStorage.getItem(`account_${uid}`)
          : localStorage.getItem("account");
        accountData = rawAcc ? JSON.parse(rawAcc) : {};
      } catch {}
      // prefer firebase auth details where available
      const authUser = auth?.currentUser;
      const merged = {
        name: authUser?.displayName || accountData.name || "Guest User",
        email: authUser?.email || accountData.email || "guest@example.com",
        avatar: accountData.avatar || authUser?.photoURL || "",
        totalIncome,
        totalExpense,
        savings,
        lastModified: (() => {
          const lmRaw = uid
            ? localStorage.getItem(`lastModified_${uid}`)
            : localStorage.getItem("lastModified");
          if (lmRaw) {
            try {
              if (!Number.isNaN(Date.parse(lmRaw)))
                return new Date(lmRaw).toISOString();
            } catch {}
            try {
              const dec = CryptoJS.AES.decrypt(lmRaw, SECRET_KEY).toString(
                CryptoJS.enc.Utf8
              );
              if (!Number.isNaN(Date.parse(dec)))
                return new Date(dec).toISOString();
            } catch {}
          }
          return accountData.lastModified || "N/A";
        })(),
        budget: Number(accountData.budget || 0),
      };

      setAccount(merged);
      // expenses flat list for charts
      const allExp = [
        ...(finance.essentialExpenses || []),
        ...(finance.discretionaryExpenses || []),
        ...(finance.educationExpenses || []),
        ...(finance.familyExpenses || []),
        ...(finance.insuranceExpenses || []),
        ...(finance.miscellaneousExpenses || []),
        ...(finance.investments || []),
        ...(finance.debts || []),
        ...(finance.expenses || []),
      ].map((e) => ({
        ...e,
        category: e.name || "Other",
        amount: parseAmount(e.amount),
      }));
      setExpenses(allExp);
    };

    if (auth?.currentUser) computeAndSet(auth.currentUser.uid);
    const unsub = onAuthStateChanged(auth, (u) => computeAndSet(u?.uid));
    return () => unsub();
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
