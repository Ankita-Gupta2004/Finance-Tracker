import { useState, useEffect } from "react";
import {ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
import { useAuth } from "../../context/AuthContext"; // adjust path

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function PersonalDetails() {
  const { user, loading } = useAuth();
  const [people, setPeople] = useState([
    { id: Date.now(), name: "", age: "", occupation: "" },
  ]);

  // Show loading while Firebase checks user
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to manage personal details.</p>;

  // Load per-user encrypted data
  useEffect(() => {
    const savedData = localStorage.getItem(`personalDetails_${user.uid}`);
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setPeople(
          decrypted.length
            ? decrypted
            : [{ id: Date.now(), name: "", age: "", occupation: "" }]
        );
      } catch (err) {
        console.error("Failed to decrypt personal details:", err);
      }
    }
  }, [user]);

  const handleChange = (id, field, value) =>
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const handleSave = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(people),
        SECRET_KEY
      ).toString();
      localStorage.setItem(`personalDetails_${user.uid}`, encrypted);
      alert("Personal details saved securely!");
    } catch (err) {
      console.error("Failed to encrypt/save personal details:", err);
      alert("Unable to save personal details.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-tr from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-6 border border-white dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Personal Details
      </h2>

      {people.map((p) => (
        <div key={p.id} className="grid grid-cols-12 gap-3 items-center">
          <input
            type="text"
            placeholder="Name"
            value={p.name}
            onChange={(e) => handleChange(p.id, "name", e.target.value)}
            className="col-span-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Age"
            value={p.age}
            onChange={(e) => handleChange(p.id, "age", e.target.value)}
            className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={p.occupation}
            onChange={(e) => handleChange(p.id, "occupation", e.target.value)}
            className="col-span-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          
        </div>
      ))}

     

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
        >
          <ClipboardCheck /> Save Details
        </button>
      </div>
    </motion.div>
  );
}
