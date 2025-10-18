import { InspectIcon, OptionIcon, PercentIcon, PieChartIcon, Table2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SipAllocatorReport() {
  const [mfs, setMfs] = useState([]);
  const [optimizerMfs, setOptimizerMfs] = useState([]);
  const [age, setAge] = useState(30);
  const [totalMf, setTotalMf] = useState(0);
  const [includeFlexi, setIncludeFlexi] = useState(true); // <-- toggle to include/exclude Flexi/Multicap

  const CATEGORY_COLORS = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  // Normalize MFs and set initial states
  useEffect(() => {
    const savedInv = JSON.parse(localStorage.getItem("investmentData") || "{}");
    const savedMfs = savedInv?.mfs || [];

    const normalized = savedMfs.map((m) => {
      const amount = Number(m.amount || 0);
      const rawCategory =
        m.category ||
        m.fundCategory ||
        m.fundTypeCategory ||
        m.fundCategoryType ||
        m.fundType ||
        m.categoryType;

      const knownCats = ["Large Cap", "Mid Cap", "Small Cap", "Flexi/Multicap"];
      let category = "Other";

      if (rawCategory && typeof rawCategory === "string") {
        const rc = rawCategory.toLowerCase();
        if (rc.includes("large")) category = "Large Cap";
        else if (rc.includes("mid")) category = "Mid Cap";
        else if (rc.includes("small")) category = "Small Cap";
        else if (rc.includes("flex") || rc.includes("multi"))
          category = "Flexi/Multicap";
        else if (knownCats.includes(rawCategory)) category = rawCategory;
      }

      if (category === "Other" && m.subCategory) {
        const s = String(m.subCategory).toLowerCase();
        if (s.includes("large")) category = "Large Cap";
        else if (s.includes("mid")) category = "Mid Cap";
        else if (s.includes("small")) category = "Small Cap";
        else if (s.includes("flex") || s.includes("multi"))
          category = "Flexi/Multicap";
      }

      return { ...m, amount, category };
    });

    setMfs(normalized);
    setOptimizerMfs(normalized.map((m) => ({ ...m })));
    const sum = normalized.reduce((s, x) => s + (x.amount || 0), 0);
    setTotalMf(sum);

    const savedPerson = JSON.parse(
      localStorage.getItem("personalDetails") || "null"
    )?.[0];
    if (savedPerson) setAge(Number(savedPerson.age) || 30);
  }, []);

  // Age-based recommended allocation
  const ageAlloc = (age) => {
    if (age < 30)
      return {
        "Large Cap": 20,
        "Mid Cap": 30,
        "Small Cap": 20,
        "Flexi/Multicap": 30,
      };
    if (age <= 45)
      return {
        "Large Cap": 30,
        "Mid Cap": 20,
        "Small Cap": 20,
        "Flexi/Multicap": 30,
      };
    if (age <= 65)
      return {
        "Large Cap": 40,
        "Mid Cap": 20,
        "Small Cap": 10,
        "Flexi/Multicap": 30,
      };
    return {
      "Large Cap": 60,
      "Mid Cap": 20,
      "Small Cap": 0,
      "Flexi/Multicap": 20,
    };
  };

  const recommended = useMemo(() => ageAlloc(age), [age]);

  // Adjust recommended when flexi excluded: redistribute flexi % equally to Large/Mid/Small
  const adjustedRecommended = useMemo(() => {
    if (includeFlexi) return { ...recommended };
    const flexPercent = recommended["Flexi/Multicap"] || 0;
    const toDistribute = flexPercent;
    const targets = ["Large Cap", "Mid Cap", "Small Cap"];
    const base = { ...recommended };
    // remove flexi
    delete base["Flexi/Multicap"];
    // distribute equally among targets that exist in base
    const presentTargets = targets.filter((t) => base.hasOwnProperty(t));
    const addEach = presentTargets.length
      ? toDistribute / presentTargets.length
      : 0;
    presentTargets.forEach((t) => {
      base[t] = (base[t] || 0) + addEach;
    });
    return base;
  }, [recommended, includeFlexi]);

  // Handle amount change for Optimizer
  const handleOptimizerAmountChange = (id, newAmount) => {
    setOptimizerMfs((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, amount: Math.max(0, Number(newAmount) || 0) } : m
      )
    );
  };

  // Compute Insights allocation
  const totalMfInsights = useMemo(
    () => mfs.reduce((sum, m) => sum + m.amount, 0),
    [mfs]
  );
  const userPercentInsights = useMemo(
    () =>
      mfs.map((m) => ({
        ...m,
        percent: totalMfInsights ? (m.amount / totalMfInsights) * 100 : 0,
      })),
    [mfs, totalMfInsights]
  );

  // Compute Optimizer allocation
  const totalMfOptimizer = useMemo(
    () => optimizerMfs.reduce((sum, m) => sum + m.amount, 0),
    [optimizerMfs]
  );
  const optimizerPercent = useMemo(
    () =>
      optimizerMfs.map((m) => ({
        ...m,
        percent: totalMfOptimizer ? (m.amount / totalMfOptimizer) * 100 : 0,
      })),
    [optimizerMfs, totalMfOptimizer]
  );

  // User allocation map (all categories)
  const userAllocationMapAll = useMemo(() => {
    const map = {};
    mfs.forEach((m) => {
      map[m.category] = (map[m.category] || 0) + m.amount;
    });
    Object.keys(recommended).forEach((c) => {
      if (!map[c]) map[c] = 0;
    });
    return map;
  }, [mfs, recommended]);

  // Flexi amount (all + optimizer)
  const flexiAmountAll = userAllocationMapAll["Flexi/Multicap"] || 0;
  const optimizerFlexiAmount = useMemo(
    () =>
      optimizerMfs.reduce(
        (s, m) =>
          s + (m.category === "Flexi/Multicap" ? Number(m.amount || 0) : 0),
        0
      ),
    [optimizerMfs]
  );

  // total used for charts/totals depending on includeFlexi
  const totalMfUsed = includeFlexi
    ? totalMf
    : Math.max(0, totalMf - flexiAmountAll);
  const totalMfOptimizerUsed = includeFlexi
    ? totalMfOptimizer
    : Math.max(0, totalMfOptimizer - optimizerFlexiAmount);

  // categories to display based on adjustedRecommended
  const categoriesOrdered = Object.keys(recommended);
  const categoriesOrderedUsed = Object.keys(adjustedRecommended);

  // user allocation map filtered (for charts)
  const userAllocationMapUsed = useMemo(() => {
    const map = {};
    categoriesOrderedUsed.forEach((c) => {
      // if excluding flexi, don't include its amount
      map[c] = userAllocationMapAll[c] || 0;
    });
    return map;
  }, [userAllocationMapAll, categoriesOrderedUsed]);

  // recommended amounts adjusted to used total based on adjustedRecommended
  //   const recommendedAmounts = categoriesOrdered.map((key) => ({
  //     name: key,
  //     value: (recommended[key] * totalMf) / 100,
  //     percent: recommended[key],
  //   }));
  const recommendedAmountsUsed = categoriesOrderedUsed.map((key) => ({
    name: key,
    value: (adjustedRecommended[key] * totalMfUsed) / 100,
    percent: adjustedRecommended[key],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-semibold">
            {p.name}: {p.value.toFixed(2)}
            {p.payload?.amount
              ? ` (₹${Number(p.payload.amount).toLocaleString()})`
              : ""}
            {p.payload?.percent ? ` — ${p.payload.percent}%` : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  // ------------------ UI (tables styled like AssetsReport.jsx) ------------------
  return (
    <section className="bg-gradient-to-t from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          SIP Allocation Report
        </h2>

        {/* Investments Table (styled like AssetsReport) */}
        <div className="overflow-x-auto bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 border border-gray-300 dark:border-gray-800 pb-2">
          <div className="flex items-center gap-2 mb-4">
          <Table2 className="text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Funds Breakdown
            </h2>
          </div>

          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                  Fund Name
                </th>
                <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                  Fund Type
                </th>
                <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                  Amount (₹)
                </th>
                <th className="py-3 px-4 text-left text-gray-900 dark:text-gray-100">
                  Contribution (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {userPercentInsights.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-600 dark:text-gray-400"
                  >
                    No funds found. Please add mutual funds in Investments.
                  </td>
                </tr>
              ) : (
                userPercentInsights.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={`${
                      idx % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/30"
                        : "bg-gray-100 dark:bg-gray-800/50"
                    } hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition`}
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                      {m.name || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.fundType || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.category || "Other"}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      ₹{Number(m.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {m.percent.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pie Charts (kept same sizing but card visuals match AssetsReport) */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-lg border border-white dark:border-gray-700">
          
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
            
              Your Current Allocation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoriesOrderedUsed.map((c) => ({
                    name: c,
                    value: userAllocationMapUsed[c] || 0,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={4}
                  cornerRadius={8}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoriesOrderedUsed.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-lg border border-white dark:border-gray-700">
            <h3 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
              Required Contribution
            </h3>
            <p className="text-center text-gray-500">"Depends on your age risk factor"</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recommendedAmountsUsed}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={4}
                  cornerRadius={8}
                  label={({ name, percent }) =>
                    `${name} ${percent.toFixed(0)}%`
                  }
                >
                  {recommendedAmountsUsed.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Insights (table styled like AssetsReport) */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-800 pb-2">
        
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
  <PercentIcon className="text-emerald-500 w-5 h-5" />
  Allocation Insights
</h3>

          <table className="w-full text-left text-sm ">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                  Category
                </th>
                <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                  Your %
                </th>
                <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                  Recommended %
                </th>
                <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriesOrderedUsed.map((key, idx) => {
                const userPerc =
                  (userAllocationMapUsed[key] / (totalMfUsed || 1)) * 100 || 0;
                const recPerc = adjustedRecommended[key] || 0;
                let status = "";
                let statusColor = "";
                if (userPerc > recPerc) {
                  status = `Overinvested by ${(userPerc - recPerc).toFixed(
                    2
                  )}%`;
                  statusColor = "text-red-500";
                } else if (userPerc < recPerc) {
                  status = `Underinvested by ${(recPerc - userPerc).toFixed(
                    2
                  )}%`;
                  statusColor = "text-green-500";
                } else {
                  status = "Perfect allocation";
                  statusColor = "text-gray-500";
                }
                return (
                  <tr
                    key={key}
                    className={`${
                      idx % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/30"
                        : "bg-gray-100 dark:bg-gray-800/50"
                    } hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition`}
                  >
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {userPerc.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {recPerc}%
                    </td>
                    <td className={`py-3 px-4 font-semibold ${statusColor}`}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Optimizer Table (table styled like AssetsReport) */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-800 pb-2">
          <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
  <InspectIcon className="text-emerald-500 w-5 h-5" />
  Allocation Optimizer
</h3>


            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={includeFlexi}
                  onChange={() => setIncludeFlexi((v) => !v)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                />
                Include Flexi/Multicap in allocation
              </label>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                  <span className="text-gray-900 dark:text-gray-200">
                    Over-Invested
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                  <span className="text-gray-900 dark:text-gray-200">
                    Under-Invested
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-500 rounded-full inline-block"></span>
                  <span className="text-gray-900 dark:text-gray-200">
                    Perfect allocation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm ">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    Fund Name
                  </th>
                  <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    Fund Type
                  </th>
                  <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    Category
                  </th>
                  <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    Amount (₹)
                  </th>
                  <th className="py-3 px-4 text-gray-900 dark:text-gray-100">
                    Contribution (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {optimizerPercent.map((m, idx) => {
                  const displayedPercent = includeFlexi
                    ? m.percent
                    : m.category === "Flexi/Multicap"
                    ? 0
                    : (m.amount / (totalMfOptimizerUsed || 1)) * 100;

                  const recPerc = adjustedRecommended[m.category] || 0;
                  const statusColor =
                    displayedPercent > recPerc
                      ? "text-red-500"
                      : displayedPercent < recPerc
                      ? "text-green-500"
                      : "text-gray-500";
                  return (
                    <tr
                      key={m.id}
                      className={`${
                        idx % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-900/30"
                          : "bg-gray-100 dark:bg-gray-800/50"
                      } hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition`}
                    >
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">
                        {m.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {m.fundType}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {m.category}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleOptimizerAmountChange(
                              m.id,
                              (m.amount || 0) - 1000
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={m.amount}
                          onChange={(e) =>
                            handleOptimizerAmountChange(
                              m.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-24 p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() =>
                            handleOptimizerAmountChange(
                              m.id,
                              (m.amount || 0) + 1000
                            )
                          }
                        >
                          +
                        </button>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${statusColor}`}>
                        {displayedPercent.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
