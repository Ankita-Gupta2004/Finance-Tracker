import { motion } from "framer-motion";
import { Wallet, DollarSign, PieChart, CreditCard, Target } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: <Wallet />,
      title: "Create Account",
      description: "Create your free FinTrack account to start managing your finances.",
    },
    {
      step: 2,
      icon: <DollarSign />,
      title: "Enter Your Expenses & Assets",
      description: "Log every expense in seconds, categorize them, and add notes for clarity.",
    },
    {
      step: 3,
      icon: <PieChart />,
      title: "Analyze Reports",
      description: "View interactive charts and summaries to understand your spending patterns.",
    },
    {
      step: 4,
      icon: <CreditCard />,
      title: "Set Budgets & Goals",
      description: "Plan monthly budgets, set goals, and monitor progress to stay on track.",
    },
    {
      step: 5,
      icon: <Target />,
      title: "Achieve Financial Goals",
      description: "Reach savings targets, optimize spending, and grow your wealth efficiently.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 flex justify-center">
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 p-8 rounded-xl shadow-md w-full max-w-5xl">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center flex items-center justify-center gap-3">
          <DollarSign className="text-emerald-500 dark:text-emerald-400" size={32} />
          How It Works
        </h2>

        {/* Numbered Steps */}
        <div className="space-y-8">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-4 p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 dark:bg-emerald-400 text-white font-bold text-lg">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Flowchart */}
        {/* Visual Flowchart */}
<div className="mt-10 flex justify-center items-center gap-4 overflow-x-auto">
  {steps.map((item, idx) => (
    <div key={idx} className="flex items-center gap-4">
      {/* Step Icon + Title */}
      <div className="flex flex-col items-center gap-2">
        {item.icon.type && (
          <item.icon.type
            className="text-emerald-500 dark:text-emerald-400"
            size={36}
          />
        )}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
          {item.title}
        </span>
      </div>

      {/* Arrow - show for all except last step */}
      {idx < steps.length - 1 && (
        <div className="text-emerald-300 dark:text-gray-600 text-2xl">→</div>
      )}
    </div>
  ))}
</div>

      </div>
    </section>
  );
}
