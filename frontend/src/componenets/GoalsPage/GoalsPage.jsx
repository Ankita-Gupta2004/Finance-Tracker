import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  PlusCircle,
  Trash2,
  Calendar,
  Target,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import ModernCTA from "./ModerCTA";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext"; // assuming you have auth context

const SECRET_KEY = "YOUR_SECRET_KEY"; // replace with a secure key

// ------------------ GoalCard Component ------------------
function GoalCard({
  title,
  description,
  goals,
  type,
  handleGoalChange,
  addGoal,
  removeGoal,
}) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-4 border border-white dark:border-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>

      {goals.map((g) => (
        <div key={g.id} className="grid grid-cols-12 gap-3 items-center">
          <input
            type="text"
            placeholder="Goal"
            value={g.goal || ""}
            onChange={(e) => handleGoalChange(type, g.id, "goal", e.target.value)}
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Target Amount (₹)"
            value={g.targetAmount || ""}
            onChange={(e) =>
              handleGoalChange(type, g.id, "targetAmount", e.target.value)
            }
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Time Frame (months/years)"
            value={g.timeFrame || ""}
            onChange={(e) => handleGoalChange(type, g.id, "timeFrame", e.target.value)}
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Current Saving ₹"
            value={g.currentSavings || ""}
            onChange={(e) =>
              handleGoalChange(type, g.id, "currentSavings", e.target.value)
            }
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {goals.length > 1 && (
            <button
              onClick={() => removeGoal(type, g.id)}
              className="col-span-1 text-red-500 hover:text-red-600"
            >
              <Trash2 />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() => addGoal(type)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
      >
        <PlusCircle /> Add {title}
      </button>
    </div>
  );
}

// ------------------ Main Component ------------------
export default function GoalsPage() {
  const [shortTermGoals, setShortTermGoals] = useState([
    { id: crypto.randomUUID(), goal: "", targetAmount: "", timeFrame: "", currentSavings: "" },
  ]);
  const [midTermGoals, setMidTermGoals] = useState([
    { id: crypto.randomUUID(), goal: "", targetAmount: "", timeFrame: "", currentSavings: "" },
  ]);
  const [longTermGoals, setLongTermGoals] = useState([
    { id: crypto.randomUUID(), goal: "", targetAmount: "", timeFrame: "", currentSavings: "" },
  ]);

  const { user } = useAuth(); // get current logged-in user

  const addGoal = (type) => {
    const newGoal = { id: crypto.randomUUID(), goal: "", targetAmount: "", timeFrame: "", currentSavings: "" };
    if (type === "short") setShortTermGoals((prev) => [...prev, newGoal]);
    if (type === "mid") setMidTermGoals((prev) => [...prev, newGoal]);
    if (type === "long") setLongTermGoals((prev) => [...prev, newGoal]);
  };

  const removeGoal = (type, id) => {
    if (type === "short") setShortTermGoals((prev) => prev.filter((g) => g.id !== id));
    if (type === "mid") setMidTermGoals((prev) => prev.filter((g) => g.id !== id));
    if (type === "long") setLongTermGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleGoalChange = (type, id, field, value) => {
    const updateGoals = (goals) => goals.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    if (type === "short") setShortTermGoals((prev) => updateGoals(prev));
    if (type === "mid") setMidTermGoals((prev) => updateGoals(prev));
    if (type === "long") setLongTermGoals((prev) => updateGoals(prev));
  };

  const handleSaveGoals = () => {
    if (!user?.uid) return alert("User not logged in!");
    const formData = { shortTermGoals, midTermGoals, longTermGoals };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(formData), SECRET_KEY + user.uid).toString();
    localStorage.setItem(`goalsData_${user.uid}`, encrypted);
    alert("Your goals have been securely saved!");
  };

  useEffect(() => {
    if (!user?.uid) return;
    const savedData = localStorage.getItem(`goalsData_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY + user.uid);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setShortTermGoals(decrypted.shortTermGoals || []);
        setMidTermGoals(decrypted.midTermGoals || []);
        setLongTermGoals(decrypted.longTermGoals || []);
      } catch (err) {
        console.error("Failed to decrypt goals data:", err);
      }
    }
  }, [user?.uid]);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen">
      <Navbar />
      <section className="py-16 max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 mt-12 mb-12"
        >
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400/40 to-teal-400 rounded-full opacity-20 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-tr from-teal-400/40 to-emerald-400 rounded-full opacity-20 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Goals & Financial Planning
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            "Set your financial goals systematically to achieve your dreams. Plan for short-term, mid-term, and long-term objectives and stay on track to achieve them efficiently."
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <Calendar className="w-14 h-14 text-emerald-600" />
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Short-term Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
              Achievable within 1 year. Examples include Vacation, Gadgets, Emergency Fund.
            </p>
          </div>
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <Briefcase className="w-14 h-14 text-blue-600" />
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Mid-term Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
              Achievable within 1-5 years. Examples include Buying a car, Home renovation, Higher studies.
            </p>
          </div>
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-6 hover:shadow-2xl transition-shadow duration-300">
            <Target className="w-14 h-14 text-pink-600" />
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Long-term Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
              Achievable in more than 5 years. Examples include Retirement, Buying property, Major investments.
            </p>
          </div>
        </div>

        {/* Goal Forms */}
        <div className="space-y-8 ">
          <GoalCard
            title="Short-term Goals"
            description="Fill in your short-term goals below."
            goals={shortTermGoals}
            type="short"
            handleGoalChange={handleGoalChange}
            addGoal={addGoal}
            removeGoal={removeGoal}
          />
          <GoalCard
            title="Mid-term Goals"
            description="Fill in your mid-term goals below."
            goals={midTermGoals}
            type="mid"
            handleGoalChange={handleGoalChange}
            addGoal={addGoal}
            removeGoal={removeGoal}
          />
          <GoalCard
            title="Long-term Goals"
            description="Fill in your long-term goals below."
            goals={longTermGoals}
            type="long"
            handleGoalChange={handleGoalChange}
            addGoal={addGoal}
            removeGoal={removeGoal}
          />
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end px-6 lg:px-8">
          <button
            onClick={handleSaveGoals}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
          >
            <ClipboardCheck /> Save All Goals
          </button>
        </div>
      </section>

      <ModernCTA />
      <Footer />
    </div>
  );
}
