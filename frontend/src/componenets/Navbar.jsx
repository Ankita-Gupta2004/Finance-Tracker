import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import {
  Home,
  CreditCard,
  PieChart,
  Target,
  BarChart2,
  Calculator,
} from "lucide-react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // new
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Expenses", href: "/expenseform" },
    { name: "Assets", href: "/assetscard" },
    { name: "Investments", href: "/investmentssection" },
    { name: "Goals", href: "/goalspage" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Report", href: "/report" },
  ];

  const calculatorLinks = [
    { name: "FD", href: "/fdcalculator" },
    { name: "RD", href: "/rdcalculator" },
    { name: "SIP", href: "/sipcalculator" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* Logo - Left */}
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            FinTrack
          </div>

          {/* Nav Items - Center */}
          <div className="hidden md:flex items-center space-x-6 justify-center flex-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Calculators Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCalcOpen(!calcOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>Calculators</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {calcOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="py-2">
                      {calculatorLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Section: Account + ThemeToggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Account Button */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <User className="w-5 h-5 mr-1" />
                <span>Account</span>
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 flex flex-col"
                  >
                    {!user ? (
                      <>
                        <a
                          href="/login"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          Login
                        </a>
                        <a
                          href="/createaccount"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          Create Account
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
      {/* Mobile Menu & Bottom Animation Bar */}
      {/* Mobile Menu - Creative Icon Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 1, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-auto px-3 py-3  bg-white/90 dark:bg-gray-900/60 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center space-x-4 z-50"
          >
            {/* Home */}
            <a
              href="/"
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </a>

            {/* Expenses */}
            <a
              href="/expenseform"
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs mt-1">Expenses</span>
            </a>

            {/* Assets */}
            <a
              href="/assetscard"
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <PieChart className="w-6 h-6" />
              <span className="text-xs mt-1">Assets</span>
            </a>

            {/* Goals */}
            <a
              href="/goalspage"
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs mt-1">Goals</span>
            </a>

            {/* Dashboard */}
            <a
              href="/dashboard"
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <BarChart2 className="w-6 h-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>

            {/* Calculators Dropdown */}
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => setCalcOpen(!calcOpen)}
                className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Calculator className="w-6 h-6" />
                <span className="text-xs mt-1">Calc</span>
              </button>

              <AnimatePresence>
                {calcOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} // can also start from y: -5 for smoother
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-40 rounded-lg shadow-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 flex flex-col"
                  >
                    {calculatorLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="absolute bottom-0 left-0 w-full h-px overflow-hidden">
        <motion.div
          className="h-px bg-emerald-500/30 rounded-full"
          initial={{ width: 0, x: 0 }}
          animate={{
            width: ["0%", "60%", "60%", "60%", "0%"], // grow, pause, shrink
            x: ["0%", "0%", "100%", "0%"], // move along the bar
          }}
          transition={{
            duration: 3,
            times: [0, 0.3, 0.7, 1], // controls pause and move timing
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>{" "}
    </nav>
  );
}
