import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; // adjust path
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function LoanAndDebt() {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState([
    { id: Date.now(), lender: "", type: "Personal", amount: "", emi: "", dueDate: "", paid: "" },
  ]);

  // Show loading while Firebase checks user
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to manage your loans.</p>;

  // Load per-user encrypted data
  useEffect(() => {
    const savedData = localStorage.getItem(`loansData_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setLoans(decrypted);
      } catch (err) {
        console.error("Failed to decrypt loans data", err);
      }
    }
  }, [user]);

  const addLoan = () =>
    setLoans([
      ...loans,
      { id: Date.now(), lender: "", type: "Personal", amount: "", emi: "", dueDate: "", paid: "" },
    ]);

  const removeLoan = (id) => setLoans(loans.filter((l) => l.id !== id));

  const handleLoanChange = (id, field, value) =>
    setLoans(loans.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const handleSave = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(loans), SECRET_KEY).toString();
      localStorage.setItem(`loansData_${user.uid}`, encrypted);
      alert("Loan & Debt data saved securely!");
    } catch (err) {
      console.error("Failed to encrypt/save loans data", err);
    }
  };

  const totalRemaining = loans.reduce((sum, l) => {
    const amount = parseFloat(l.amount) || 0;
    const paid = parseFloat(l.paid) || 0;
    return sum + (amount - paid);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/40 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Loans & Debts
      </h2>

      {loans.map((l) => (
        <div key={l.id} className="grid grid-cols-12 gap-3 items-center">
          <input
            type="text"
            placeholder="Lender Name"
            value={l.lender}
            onChange={(e) => handleLoanChange(l.id, "lender", e.target.value)}
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <select
            value={l.type}
            onChange={(e) => handleLoanChange(l.id, "type", e.target.value)}
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option>Personal</option>
            <option>Home</option>
            <option>Vehicle</option>
            <option>Education</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            placeholder="Amount (₹)"
            value={l.amount}
            onChange={(e) => handleLoanChange(l.id, "amount", e.target.value)}
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="EMI (₹)"
            value={l.emi}
            onChange={(e) => handleLoanChange(l.id, "emi", e.target.value)}
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Paid Till Now (₹)"
            value={l.paid || ""}
            onChange={(e) => handleLoanChange(l.id, "paid", e.target.value)}
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />

          {loans.length > 1 && (
            <button
              onClick={() => removeLoan(l.id)}
              className="col-span-1 text-red-500 hover:text-red-600"
            >
              <Trash2 />
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={addLoan}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          <PlusCircle /> Add Loan
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-950 rounded-lg text-right">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          Total Remaining Loan: ₹{totalRemaining.toLocaleString()}
        </span>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          <ClipboardCheck /> Save Loans & Debts
        </button>
      </div>
    </motion.div>
  );
}
