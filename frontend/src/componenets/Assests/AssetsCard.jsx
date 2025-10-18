// AssetsCard.jsx
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  ClipboardCheck,
  Home,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../Footer";
import Navbar from "../Navbar";
import CryptoJS from "crypto-js"; // NEW
import { useAuth } from "../../context/AuthContext";


export default function AssetsCard() {
  const [assets, setAssets] = useState([
  { id: crypto.randomUUID(), name: "", type: "Cash", value: "", note: "" },
]);
const { user, loading } = useAuth();

if (loading) return <p>Loading...</p>; // show spinner while Firebase checks user
if (!user) return <p>Please log in to view your assets.</p>; // show if not logged in

  


const SECRET_KEY = "my_assets_secret_key_123"; // NEW: encryption key

const storageKey = `assetsData_${user?.uid}`; // NEW: per-user storage key



  // Load from localStorage
useEffect(() => {
  if (!user) return;
  const encrypted = localStorage.getItem(storageKey);
  if (encrypted) {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const parsed = JSON.parse(decrypted);
      setAssets(parsed);
    } catch (err) {
      console.error("Decryption failed:", err);
      setAssets([
        { id: crypto.randomUUID(), name: "", type: "Cash", value: "", note: "" },
      ]);
    }
  }
}, [user]);
const addAsset = () => {
    setAssets((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", type: "Cash", value: "", note: "" },
    ]);
  };

const removeAsset = (id) => {
  setAssets((prev) => prev.filter((a) => a.id !== id));
};



  const handleAssetChange = (id, field, value) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

 const saveAssets = (data) => { // NEW helper
  if (!user) return;
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(storageKey, encrypted);
    alert("Assets saved locally!");
  } catch (err) {
    console.error("Encryption failed:", err);
    alert("Failed to save assets.");
  }
};

const handleSave = () => {
  saveAssets(assets); // NEW
};

  const totalAssetsValue = assets.reduce(
    (sum, asset) => sum + Number(asset.value || 0),
    0
  );
  const assetInfo = [
    {
      scheme: "SGB",
      fullForm: "Sovereign Gold Bond",
      type: "Gold Investment",
      lockIn: "8 yrs (exit after 5)",
      risk: "Low",
      returnType: "Gold price + 2.5% interest",
      taxBenefit: "Partial",
      suitableFor: "Long-term gold investors",
    },
    {
      scheme: "ULIP",
      fullForm: "Unit Linked Insurance Plan",
      type: "Insurance + Investment",
      lockIn: "5 yrs",
      risk: "Moderate–High",
      returnType: "Market-linked",
      taxBenefit: "Yes (80C)",
      suitableFor: "Dual benefit seekers",
    },
    {
      scheme: "EPF",
      fullForm: "Employee Provident Fund",
      type: "Retirement (salary-based)",
      lockIn: "Till retirement",
      risk: "Very Low",
      returnType: "Fixed interest",
      taxBenefit: "Yes (80C)",
      suitableFor: "Salaried employees",
    },
    {
      scheme: "VPF",
      fullForm: "Voluntary Provident Fund",
      type: "Retirement (voluntary)",
      lockIn: "Till retirement",
      risk: "Very Low",
      returnType: "Fixed interest",
      taxBenefit: "Yes (80C)",
      suitableFor: "Employees saving extra",
    },
    {
      scheme: "PPF",
      fullForm: "Public Provident Fund",
      type: "Public Savings",
      lockIn: "15 yrs",
      risk: "Very Low",
      returnType: "Fixed interest",
      taxBenefit: "Yes (80C)",
      suitableFor: "Everyone for long-term savings",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 "
          >
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
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mt-10">
              Track Your Assets
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              "Keep a detailed record of your assets and understand your
              financial position. Assets include cash, bank accounts, real
              estate, investments, and more."
            </p>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Assets Card */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 flex items-center justify-center">
                <Home className="w-14 h-14 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white text-center">
                Assets
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
                Anything you own that has value and can be converted to cash,
                like savings, property, or investments.
              </p>
            </div>

            {/* Liabilities Card */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 p-8 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-800 flex items-center justify-center">
                <CreditCard className="w-14 h-14 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white text-center">
                Liabilities
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
                Debts or financial obligations you owe, such as loans, credit
                card debt, or mortgages.
              </p>
            </div>
          </div>

          {/* Assets Form */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800 mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assets Form
            </h2>

            {assets.map((a) => (
              <div key={a.id} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={a.name}
                  onChange={(e) =>
                    handleAssetChange(a.id, "name", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <select
                  value={a.type}
                  onChange={(e) =>
                    handleAssetChange(a.id, "type", e.target.value)
                  }
                  className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>Cash</option>
                  <option>Bank Account</option>
                  <option>Real Estate</option>
                  <option>Ornaments</option>
                  <option>Vehicle</option>
                  <option>SGB</option>
                  <option>ULIPS</option>
                  <option>EPF</option>
                  <option>PPF</option>
                  <option>VPF</option>
                  <option>Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Current Value (₹)"
                  value={a.value}
                  onChange={(e) =>
                    handleAssetChange(a.id, "value", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Note"
                  value={a.note}
                  onChange={(e) =>
                    handleAssetChange(a.id, "note", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                {assets.length > 1 && (
                  <button
                    onClick={() => removeAsset(a.id)}
                    className="col-span-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              <button
                onClick={addAsset}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                <PlusCircle /> Add Asset
              </button>
            </div>
            <div className="text-right mt-4">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                Total Assets: ₹ {totalAssetsValue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
              >
                <ClipboardCheck /> Save Assets
              </button>
            </div>
          </motion.div>
        </div>
        <div className="overflow-x-auto mt-12 ml-12 mr-12">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium text-sm shadow-md"
            >
              <DollarSign className="w-4 h-4" />
              <span>Asset Types Reference</span>
            </motion.div>
          </div>

          <table className="min-w-full bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-gray-300 dark:bg-gray-900 border-b border-teal-800 dark:border-teal-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Scheme
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Full Form
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Lock-in
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Risk
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Return Type
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Tax Benefit
                </th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-200">
                  Suitable For
                </th>
              </tr>
            </thead>
            <tbody>
              {assetInfo.map((a, idx) => (
                <tr
                  key={a.scheme}
                  className={`${
                    idx % 2 === 0
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  } border-b border-gray-200 dark:border-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors`}
                >
                  <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                    {a.scheme}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.fullForm}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.type}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.lockIn}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.risk}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.returnType}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.taxBenefit}
                  </td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                    {a.suitableFor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  );
}
