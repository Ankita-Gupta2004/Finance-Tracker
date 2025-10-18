import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SavingsSection() {
  const [savings, setSavings] = useState([
    { id: crypto.randomUUID(), name: "", amount: "", targetDate: "" },
  ]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem("savingsData");
    if (saved) {
      setSavings(JSON.parse(saved));
    }
  }, []);

  // Handlers
  const addSaving = () =>
    setSavings([
      ...savings,
      { id: crypto.randomUUID(), name: "", amount: "", targetDate: "" },
    ]);

  const removeSaving = (id) => setSavings(savings.filter((s) => s.id !== id));

  const handleSavingChange = (id, field, value) =>
    setSavings(
      savings.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );

  const handleSaveSavings = () => {
    localStorage.setItem("savingsData", JSON.stringify(savings));
    alert("Your savings have been saved locally on this device!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/40 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Savings / Emergency Fund
      </h2>

      {savings.map((s) => (
        <div key={s.id} className="grid grid-cols-12 gap-3 items-center">
          <input
            type="text"
            placeholder="Goal Name"
            value={s.name}
            onChange={(e) => handleSavingChange(s.id, "name", e.target.value)}
            className="col-span-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={s.amount}
            onChange={(e) => handleSavingChange(s.id, "amount", e.target.value)}
            className="col-span-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            placeholder="Target Date"
            value={s.targetDate}
            onChange={(e) =>
              handleSavingChange(s.id, "targetDate", e.target.value)
            }
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {savings.length > 1 && (
            <button
              onClick={() => removeSaving(s.id)}
              className="col-span-1 text-red-500 hover:text-red-600"
            >
              <Trash2 />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addSaving}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
      >
        <PlusCircle /> Add Savings Goal
      </button>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSavings}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          <ClipboardCheck /> Save Savings
        </button>
      </div>
    </motion.div>
  );
}
