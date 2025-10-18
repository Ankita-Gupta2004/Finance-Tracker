import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiPieChart,
  FiCreditCard,
  FiBarChart2,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { Calculator } from "lucide-react";

const faqs = [
  {
    question: "What is FinTrack?",
    icon: <FiBarChart2 className="w-6 h-6 text-emerald-500" />,
    answer:
      "This platform is a complete Finance Tracker. It helps you track expenses, analyze spending patterns, visualize reports, set budgets and goals, and even calculate your FIRE (Financial Independence, Retire Early) number, all in one place.",
  },

  {
    question: "What is a FIRE Number?",
    icon: <FiDollarSign className="w-6 h-6 text-emerald-500" />,
    answer:
      "Your FIRE number is the total amount you need to retire comfortably. Use our calculator to estimate your Lean FIRE number based on your expenses and desired retirement age.",
  },
  {
    question: "How do I track my expenses?",
    icon: <FiCreditCard className="w-6 h-6 text-emerald-500" />,
    answer:
      "Log all your transactions in real-time, categorize them into different expense types, and view your spending trends instantly on the dashboard.",
  },
  {
    question: "Can I visualize my financial reports?",
    icon: <FiPieChart className="w-6 h-6 text-emerald-500" />,
    answer:
      "Yes! Our platform provides detailed visual reports and charts to help you understand your income, spending, and savings patterns at a glance.",
  },
  {
    question: "Is my data secure?",
    icon: <FiShield className="w-6 h-6 text-emerald-500" />,
    answer:
"All your financial data is stored only on your device in local storage — never shared or sent to any server.",  },
  {
    question: "Can I set financial goals and budgets?",
    icon: <FiBarChart2 className="w-6 h-6 text-emerald-500" />,
    answer:
      "Yes! Set monthly budgets, create savings goals, and track your progress over time to achieve financial discipline and reach FIRE sooner.",
  },
  {
  question: "Can I calculate FD, RD, or SIP returns?",
  icon: <Calculator className="w-6 h-6 text-emerald-500" />,
  answer:
    "Yes! Use our built-in calculators to quickly compute FD, RD, and SIP returns based on your investment amount, tenure, and interest rates.",
}

];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none gap-3"
              >
                <div className="flex items-center gap-3">
                  {faq.icon}
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    {faq.question}
                  </span>
                </div>
                {openIndex === index ? (
                  <motion.div
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronUp className="text-emerald-500 w-6 h-6" />
                  </motion.div>
                ) : (
                  <FiChevronDown className="text-emerald-500 w-6 h-6" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-6 text-left text-gray-800 dark:text-gray-300 text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
