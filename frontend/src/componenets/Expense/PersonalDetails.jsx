import { useState, useEffect } from "react";
import { PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PersonalDetails() {
  const [people, setPeople] = useState([
    { id: Date.now(), name: "", age: "", occupation: "" },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("personalDetails");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const normalized = parsed.map((p) => ({
          id: p.id || Date.now(),
          name: p.name || "",
          age: p.age || "",
          occupation: p.occupation || "",
        }));
        setPeople(normalized);
      } catch (err) {
        console.error("Failed to parse personalDetails:", err);
      }
    }
  }, []);



  const removePerson = (id) => setPeople(people.filter((p) => p.id !== id));

  const handleChange = (id, field, value) =>
    setPeople(
      people.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );

  const handleSave = () => {
    localStorage.setItem("personalDetails", JSON.stringify(people));
    alert("Personal details saved locally!");
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
            onChange={(e) =>
              handleChange(p.id, "occupation", e.target.value)
            }
            className="col-span-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {people.length > 1 && (
            <button
              onClick={() => removePerson(p.id)}
              className="col-span-1 text-red-500 hover:text-red-600"
            >
              <Trash2 />
            </button>
          )}
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
