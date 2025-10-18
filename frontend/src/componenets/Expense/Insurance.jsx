import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; // adjust path
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function Insurance() {
  const { user, loading } = useAuth();
  const [insurances, setInsurances] = useState([
    { id: Date.now(), provider: "", type: "Life", premium: "", maturity: "" },
  ]);

  // Show loading while Firebase checks user
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to manage your insurances.</p>;

  // Load encrypted data per user
  useEffect(() => {
    const savedData = localStorage.getItem(`insurancesData_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setInsurances(decrypted);
      } catch (err) {
        console.error("Failed to decrypt insurance data", err);
      }
    }
  }, [user]);

  const addInsurance = () =>
    setInsurances([
      ...insurances,
      { id: Date.now(), provider: "", type: "Life", premium: "", maturity: "" },
    ]);

  const removeInsurance = (id) =>
    setInsurances(insurances.filter((i) => i.id !== id));

  const handleInsuranceChange = (id, field, value) =>
    setInsurances(
      insurances.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );

  const handleSave = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(insurances),
        SECRET_KEY
      ).toString();
      localStorage.setItem(`insurancesData_${user.uid}`, encrypted);
      alert("Insurance data saved securely!");
    } catch (err) {
      console.error("Failed to encrypt/save insurance data", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/40 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Insurance Plans
      </h2>

      {insurances.map((i) => (
        <div key={i.id} className="grid grid-cols-12 gap-3 items-center">
          <input
            type="text"
            placeholder="Provider Name"
            value={i.provider}
            onChange={(e) =>
              handleInsuranceChange(i.id, "provider", e.target.value)
            }
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <select
            value={i.type}
            onChange={(e) =>
              handleInsuranceChange(i.id, "type", e.target.value)
            }
            className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option>Life</option>
            <option>Health</option>
            <option>Vehicle</option>
            <option>Property</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            placeholder="Premium (₹)"
            value={i.premium}
            onChange={(e) =>
              handleInsuranceChange(i.id, "premium", e.target.value)
            }
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            placeholder="Maturity Date"
            value={i.maturity}
            onChange={(e) =>
              handleInsuranceChange(i.id, "maturity", e.target.value)
            }
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {insurances.length > 1 && (
            <button
              onClick={() => removeInsurance(i.id)}
              className="col-span-1 text-red-500 hover:text-red-600"
            >
              <Trash2 />
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={addInsurance}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          <PlusCircle /> Add Insurance
        </button>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          <ClipboardCheck /> Save Insurances
        </button>
      </div>
    </motion.div>
  );
}
