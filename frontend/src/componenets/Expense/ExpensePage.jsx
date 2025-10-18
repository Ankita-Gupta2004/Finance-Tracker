import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import SavingsSection from "./SavingSection";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ClipboardCheck } from "lucide-react";
import FormGuidelines from "./FormGuidelines";
import Insurance from "./Insurance";
import LoanandDebt from "./LoanandDebt";
import PersonalDetails from "./PersonalDetails";
export default function FinanceForm() {
  // ---------------- INCOME ----------------
 
  const [primaryIncome, setPrimaryIncome] = useState("");
  const [otherIncome, setOtherIncome] = useState([
    { id: 1, source: "", amount: "" },
  ]);

  const addOtherIncome = () => {
    setOtherIncome([
      ...otherIncome,
      { id: Date.now(), source: "", amount: "" },
    ]);
  };

  const removeOtherIncome = (id) => {
    setOtherIncome(otherIncome.filter((i) => i.id !== id));
  };

  const handleOtherIncomeChange = (id, field, value) => {
    setOtherIncome(
      otherIncome.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const totalIncome =
    Number(primaryIncome || 0) +
    otherIncome.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  // ------------ Add: save income handler -------------
  const handleSaveIncome = () => {
    try {
      const saved = localStorage.getItem("financeData");
      const existing = saved ? JSON.parse(saved) : {};
      const updated = {
        ...existing,
        primaryIncome,
        otherIncome,
        totalIncome,
      };
      localStorage.setItem("financeData", JSON.stringify(updated));
      localStorage.setItem("lastModified", new Date().toISOString());
      alert("Income saved locally on this device!");
    } catch (err) {
      console.error(err);
      alert("Unable to save income locally.");
    }
  };
  // ---------------- EXPENSES ----------------
  const [essentialExpenses, setEssentialExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);

  const [investments, setInvestments] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [discretionaryExpenses, setDiscretionaryExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [debts, setDebts] = useState([{ id: 1, name: "", amount: "" }]);
  const [educationExpenses, setEducationExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [familyExpenses, setFamilyExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [insuranceExpenses, setInsuranceExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [miscellaneousExpenses, setMiscellaneousExpenses] = useState([
    { id: 1, name: "", amount: "" },
  ]);
  const [savings, setSavings] = useState([
    { id: 1, name: "", amount: "", targetDate: "" },
  ]);

  const addExpense = (section) => {
    const newRow = { id: Date.now(), name: "", amount: "" };
    if (section === "essential")
      setEssentialExpenses([...essentialExpenses, newRow]);
    else if (section === "investments")
      setInvestments([...investments, newRow]);
    else if (section === "discretionary")
      setDiscretionaryExpenses([...discretionaryExpenses, newRow]);
    else if (section === "debts") setDebts([...debts, newRow]);
    else if (section === "education")
      setEducationExpenses([...educationExpenses, newRow]);
    else if (section === "family")
      setFamilyExpenses([...familyExpenses, newRow]);
    else if (section === "insurance")
      setInsuranceExpenses([...insuranceExpenses, newRow]);
    else if (section === "miscellaneous")
      setMiscellaneousExpenses([...miscellaneousExpenses, newRow]);
  };

  const removeExpense = (section, id) => {
    if (section === "essential")
      setEssentialExpenses(essentialExpenses.filter((e) => e.id !== id));
    else if (section === "investments")
      setInvestments(investments.filter((e) => e.id !== id));
    else if (section === "discretionary")
      setDiscretionaryExpenses(
        discretionaryExpenses.filter((e) => e.id !== id)
      );
    else if (section === "debts") setDebts(debts.filter((e) => e.id !== id));
    else if (section === "education")
      setEducationExpenses(educationExpenses.filter((e) => e.id !== id));
    else if (section === "family")
      setFamilyExpenses(familyExpenses.filter((e) => e.id !== id));
    else if (section === "insurance")
      setInsuranceExpenses(insuranceExpenses.filter((e) => e.id !== id));
    else if (section === "miscellaneous")
      setMiscellaneousExpenses(
        miscellaneousExpenses.filter((e) => e.id !== id)
      );
  };

  const handleExpenseChange = (section, id, field, value) => {
    if (section === "essential")
      setEssentialExpenses(
        essentialExpenses.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        )
      );
    else if (section === "investments")
      setInvestments(
        investments.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    else if (section === "discretionary")
      setDiscretionaryExpenses(
        discretionaryExpenses.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        )
      );
    else if (section === "debts")
      setDebts(debts.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    else if (section === "education")
      setEducationExpenses(
        educationExpenses.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        )
      );
    else if (section === "family")
      setFamilyExpenses(
        familyExpenses.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    else if (section === "insurance")
      setInsuranceExpenses(
        insuranceExpenses.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        )
      );
    else if (section === "miscellaneous")
      setMiscellaneousExpenses(
        miscellaneousExpenses.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        )
      );
  };

  const totalEssential = essentialExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  const totalInvestments = investments.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const netBalance = totalIncome - totalEssential - totalInvestments;
  const handleSave = () => {
    const formData = {
      primaryIncome,
      otherIncome,
      essentialExpenses,
      discretionaryExpenses,
      debts,
      educationExpenses,
      familyExpenses,
      insuranceExpenses,
      miscellaneousExpenses,
      investments,
      savings,
      totalIncome,
      totalEssential,
      totalInvestments,
      netBalance,
    };

    // Save to user's browser
    localStorage.setItem("financeData", JSON.stringify(formData));
    localStorage.setItem("lastModified", new Date().toISOString());

    alert("Your data has been saved locally on this device!");
  };
  useEffect(() => {
    const savedData = localStorage.getItem("financeData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setPrimaryIncome(data.primaryIncome || "");
      setOtherIncome(data.otherIncome || [{ id: 1, source: "", amount: "" }]);
      setEssentialExpenses(
        data.essentialExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setDiscretionaryExpenses(
        data.discretionaryExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setDebts(data.debts || [{ id: 1, name: "", amount: "" }]);
      setEducationExpenses(
        data.educationExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setFamilyExpenses(
        data.familyExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setInsuranceExpenses(
        data.insuranceExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setMiscellaneousExpenses(
        data.miscellaneousExpenses || [{ id: 1, name: "", amount: "" }]
      );
      setInvestments(data.investments || [{ id: 1, name: "", amount: "" }]);
      setSavings(
        data.savings || [{ id: 1, name: "", amount: "", targetDate: "" }]
      );
    }
  }, []);

  return (
    <>
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen">
        {/* Top-left Blob */}
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400/40 to-teal-400 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-tr from-teal-400/40 to-emerald-400 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 mt-8 mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Expense Wallet
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-xs lg:text-base max-w-3xl mx-auto leading-relaxed">
              "Fill out your financial information systematically. Proper
              tracking of income, essential and discretionary expenses will help
              you manage your finances and plan savings effectively."
            </p>
          </motion.div>

          <FormGuidelines></FormGuidelines>
          <PersonalDetails></PersonalDetails>

          {/* ---------------- INCOME SECTION ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
          >
            <h2 className="text-2xl font-bold text-y-900 dark:text-white">
              Income
            </h2>
            {/* Primary Income */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Primary Income (₹)
              </label>
              <input
                type="number"
                value={primaryIncome}
                onChange={(e) => setPrimaryIncome(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Other Income */}
            <div className="space-y-3">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Other Income Sources
              </h3>
              {otherIncome.map((i) => (
                <div
                  key={i.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <input
                    type="text"
                    placeholder="Source (Rental, Freelance)"
                    value={i.source}
                    onChange={(e) =>
                      handleOtherIncomeChange(i.id, "source", e.target.value)
                    }
                    className="col-span-8 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={i.amount}
                    onChange={(e) =>
                      handleOtherIncomeChange(i.id, "amount", e.target.value)
                    }
                    className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {otherIncome.length > 1 && (
                    <button
                      onClick={() => removeOtherIncome(i.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOtherIncome}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Source
              </button>
            </div>

            {/* --------- NEW: Total Income + Save Income button --------- */}
            <div className="mt-4 flex items-center justify-between">
              <div className="font-bold text-gray-900 dark:text-white">
                Total Income: ₹{totalIncome.toLocaleString()}
              </div>
              <button
                onClick={handleSaveIncome}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition"
              >
                <ClipboardCheck /> Save Income
              </button>
            </div>
            {/* ...rest of existing income card content if any... */}
          </motion.div>

          {/* ---------------- EXPENSES SECTION ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Expenses
            </h2>

            {/* Essential Expenses */}
            <div className="space-y-3">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Essential Expenses
              </h3>
              {essentialExpenses.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  {/* Expense Name / Category Dropdown */}
                  <select
                    value={e.name}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "essential",
                        e.id,
                        "name",
                        ev.target.value
                      )
                    }
                    className="col-span-9 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Groceries / Food">Groceries / Food</option>
                    <option value="Rent / Mortgage">Rent / Mortgage</option>
                    <option value="Utilities: Electricity, Water, Gas">
                      Utilities: Electricity, Water, Gas
                    </option>
                    <option value="Internet / Phone / TV">
                      Internet / Phone / TV
                    </option>
                    <option value="Transportation: Fuel, Cab/Bus, Vehicle Maintenance">
                      Transportation
                    </option>
                    <option value="Healthcare: Insurance, Medicines, Doctor Visits">
                      Healthcare
                    </option>
                    <option value="Household Supplies: Cleaning, Toiletries">
                      Household Supplies
                    </option>
                  </select>

                  {/* Amount */}
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={e.amount}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "essential",
                        e.id,
                        "amount",
                        ev.target.value
                      )
                    }
                    className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />

                  {/* Remove Button */}
                  {essentialExpenses.length > 1 && (
                    <button
                      onClick={() => removeExpense("essential", e.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addExpense("essential")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Essential Expense
              </button>
            </div>
            <div className="space-y-3 mt-6">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Lifestyle / Discretionary Expenses
              </h3>
              {discretionaryExpenses.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  {/* Category Dropdown */}
                  <select
                    value={e.name}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "discretionary",
                        e.id,
                        "name",
                        ev.target.value
                      )
                    }
                    className="col-span-9 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Dining Out / Restaurants">
                      Dining Out / Restaurants
                    </option>
                    <option value="Entertainment: Movies, Streaming, Hobbies">
                      Entertainment
                    </option>
                    <option value="Shopping: Clothes, Electronics">
                      Shopping
                    </option>
                    <option value="Travel / Vacation">Travel / Vacation</option>
                    <option value="Fitness / Gym / Sports">
                      Fitness / Gym / Sports
                    </option>
                  </select>

                  {/* Amount */}
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={e.amount}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "discretionary",
                        e.id,
                        "amount",
                        ev.target.value
                      )
                    }
                    className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />

                  {/* Remove Button */}
                  {discretionaryExpenses.length > 1 && (
                    <button
                      onClick={() => removeExpense("discretionary", e.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addExpense("discretionary")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Lifestyle Expense
              </button>
            </div>

            {/* Education / Skill Development */}
            <div className="space-y-3 mt-6">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Education / Skill Development
              </h3>
              {educationExpenses.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <select
                    value={e.name}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "education",
                        e.id,
                        "name",
                        ev.target.value
                      )
                    }
                    className="col-span-9 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Courses / Certifications">
                      Courses / Certifications
                    </option>
                    <option value="Books / Study Material">
                      Books / Study Material
                    </option>
                    <option value="Workshops / Seminars">
                      Workshops / Seminars
                    </option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={e.amount}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "education",
                        e.id,
                        "amount",
                        ev.target.value
                      )
                    }
                    className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {educationExpenses.length > 1 && (
                    <button
                      onClick={() => removeExpense("education", e.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addExpense("education")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Education Expense
              </button>
            </div>

            {/* ---------------- Family / Personal ---------------- */}
            <div className="space-y-3 mt-6">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Family / Personal
              </h3>
              {familyExpenses.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <select
                    value={e.name}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "family",
                        e.id,
                        "name",
                        ev.target.value
                      )
                    }
                    className="col-span-9 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Gifts / Donations">Gifts / Donations</option>
                    <option value="Kids / Elderly Expenses">
                      Kids / Elderly Expenses
                    </option>
                    <option value="Personal Care / Salon / Spa">
                      Personal Care / Salon / Spa
                    </option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={e.amount}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "family",
                        e.id,
                        "amount",
                        ev.target.value
                      )
                    }
                    className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {familyExpenses.length > 1 && (
                    <button
                      onClick={() => removeExpense("family", e.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addExpense("family")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Family Expense
              </button>
            </div>

            {/* ---------------- Miscellaneous ---------------- */}
            <div className="space-y-3 mt-6">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">
                Miscellaneous
              </h3>
              {miscellaneousExpenses.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <select
                    value={e.name}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "miscellaneous",
                        e.id,
                        "name",
                        ev.target.value
                      )
                    }
                    className="col-span-9 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Unexpected Expenses">
                      Unexpected Expenses
                    </option>
                    <option value="One-time purchases">
                      One-time purchases
                    </option>
                    <option value="Subscriptions (Apps, Magazines)">
                      Subscriptions
                    </option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={e.amount}
                    onChange={(ev) =>
                      handleExpenseChange(
                        "miscellaneous",
                        e.id,
                        "amount",
                        ev.target.value
                      )
                    }
                    className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {miscellaneousExpenses.length > 1 && (
                    <button
                      onClick={() => removeExpense("miscellaneous", e.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addExpense("miscellaneous")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
              >
                <PlusCircle /> Add Miscellaneous Expense
              </button>
            </div>
            <div className="mt-8 flex justify-end px-6 lg:px-8">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
              >
                <ClipboardCheck /> Save
              </button>
            </div>
          </motion.div>
          <LoanandDebt></LoanandDebt>
          <Insurance></Insurance>

          <SavingsSection savings={savings} setSavings={setSavings} />
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}
