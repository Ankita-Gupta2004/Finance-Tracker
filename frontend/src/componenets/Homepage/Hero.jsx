import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, BarChart2, Info, CreditCard } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";

const Hero = () => {
  const dynamicWords = [
    "Finances",
    "Expenses",
    "Dashboard",
    "Goals",
    "Investments",
    "Assets & Liabilities",
    "Finance Report",
  ];
  const [index, setIndex] = useState(0);

  // Change word every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const floatShape = (i) => ({
    y: [0, -20 - i * 5, 0],
    x: [0, 20 + i * 5, 0],
    rotate: [0, 15, -15, 0],
    transition: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
  });

  const shapes = [
    {
      size: 30,
      pos: { top: "15%", left: "10%" },
      color: "from-emerald-400 to-teal-400",
    },
    {
      size: 30,
      pos: { top: "15%", right: "15%" },
      color: "from-emerald-300 to-teal-300",
    },
    {
      size: 30,
      pos: { bottom: "5%", left: "20%" },
      color: "from-emerald-500 to-teal-500",
    },
    {
      size: 30,
      pos: { bottom: "30%", right: "10%" },
      color: "from-teal-400 to-emerald-400",
    },
    {
      size: 30,
      pos: { top: "50%", left: "2%" },
      color: "from-teal-300 to-emerald-300",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 py-24 lg:py-32">
      {/* Floating Shapes */}
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          animate={floatShape(i)}
          className={`absolute rounded-full bg-gradient-to-tr ${shape.color} opacity-20 dark:opacity-10`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            ...shape.pos,
          }}
        />
      ))}

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium text-sm"
        >
          <DollarSign className="w-4 h-4" />
          <span>Own Every Step of Your Financial Path</span>
        </motion.div>
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-snug text-gray-900 dark:text-white"
        >
          Take Full{" "}
          <span className="text-emerald-800 dark:text-emerald-400">
            Control
          </span>
          <span> of Your </span>
          <div className="relative h-16 sm:h-20 md:h-24 overflow-hidden flex justify-center items-center mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
                exit={{ y: -40, opacity: 0, transition: { duration: 0.5 } }}
                className="text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-300
 font-extrabold"
              >
                {dynamicWords[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12"
        >
          "Track your spending, manage your goals, and optimize your finances
          effortlessly. Visualize your cash flow, monitor investments, and make
          smarter decisions—all from one sleek, powerful dashboard."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
        >
          {/* Primary Button */}
          <Link
            to="/createaccount"
            className="relative inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-600 text-white font-bold shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Secondary Button */}
          <Link
            to="/expenseform"
            className="relative inline-flex items-center px-8 py-3 rounded-xl border-2 border-emerald-500 text-emerald-500 font-semibold shadow-sm hover:shadow-md hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-teal-400 transform transition-all duration-300 hover:scale-105"
          >
            Fill Your Expenses
            <CreditCard className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Floating Finance Icons */}
        <BarChart2
          className="absolute bottom-20 right-1/4 w-20 h-20 text-emerald-600 opacity-15 animate-spin-slow"
          strokeWidth={1}
        />
      </div>
    </section>
  );
};

export default Hero;
