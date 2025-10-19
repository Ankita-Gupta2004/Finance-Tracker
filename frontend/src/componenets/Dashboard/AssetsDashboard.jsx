import React, { useState, useEffect } from "react";
import {
  Home,
  CreditCard,
  Banknote,
  Car,
  Diamond,
  Archive,
} from "lucide-react";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js"; // NEW
import { useAuth } from "../../context/AuthContext"; // NEW

// Map asset types to icons and colors
const ASSET_ICONS = {
  Cash: { icon: Banknote, color: "text-emerald-500" },
  "Bank Account": { icon: CreditCard, color: "text-blue-500" },
  "Real Estate": { icon: Home, color: "text-purple-500" },
  Ornaments: { icon: Diamond, color: "text-yellow-400" },
  Vehicle: { icon: Car, color: "text-pink-500" },
  Investments: { icon: Archive, color: "text-indigo-500" },
  Other: { icon: Archive, color: "text-gray-500" },
};

export default function AssetsDashboard() {
  const { user, loading } = useAuth();
  const [assets, setAssets] = useState([]);
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; // same key as in AssetsCard

  // Loading state
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your assets.</p>;

  useEffect(() => {
    if (!user) return;

    const storageKey = `assetsData_${user.uid}`;
    const encrypted = localStorage.getItem(storageKey);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setAssets(decrypted);
      } catch (err) {
        console.error("Failed to decrypt assets:", err);
        setAssets([]);
      }
    }
  }, [user, SECRET_KEY]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Assets Overview
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {assets.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-12">
            No assets recorded yet.
          </p>
        )}
        {assets.map((a) => {
          const { icon: Icon, color } =
            ASSET_ICONS[a.type] || ASSET_ICONS.Other;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-black p-4 rounded-xl shadow flex items-center gap-4 hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {a.name || "Unnamed Asset"}
                  </h3>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    ₹{Number(a.value || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {a.type}
                </p>
                {a.note && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    {a.note}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
