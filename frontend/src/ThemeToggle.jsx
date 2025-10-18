import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="flex items-center cursor-pointer select-none"
      onClick={() => setDarkMode(prev => !prev)}
    >
      {/* Track */}
      <div
        className={`w-16 h-8 rounded-full p-1 bg-gray-300 dark:bg-gray-700 relative`}
      >
        {/* Sliding Circle */}
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center
            transform transition-all duration-300 ease-in-out absolute top-1
            ${darkMode ? "translate-x-8" : "translate-x-0"}`}
        >
          {darkMode ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-gray-700" />}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
