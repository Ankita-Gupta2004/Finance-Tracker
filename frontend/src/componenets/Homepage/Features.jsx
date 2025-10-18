import {
  CreditCard,
  PieChart,
  DollarSign,
  BarChart2,
  CheckCircle,
  Wallet,
  Activity,
  Shield,
  Calculator,
  FireExtinguisher,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: <DollarSign size={32} />,
    title: "Track Expenses",
    description:
      "Log your spending in real-time and categorize every transaction effortlessly.",
  },
  {
    icon: <PieChart size={32} />,
    title: "Visual Reports",
    description:
      "Understand your finances with clean charts and detailed reports.",
  },
  {
    icon: <CreditCard size={32} />,
    title: "Secure & Private",
    description:
      "Your financial data is stored in your device storage, never shared or sent to any server.",
  },
  {
    icon: <BarChart2 size={32} />,
    title: "Set Goals",
    description:
      "Plan your finances, set monthly goals, and achieve them consistently.",
  },
  {
    icon: <CheckCircle size={32} />,
    title: "Manage Assets",
description: "Keep track of your assets and their values effortlessly.",

  },
  {
    icon: <Calculator size={32} />,
   title: "Calculators",
description: "Quickly calculate FD, RD, and SIP returns to plan your finances smarter.",

  },
  {
    icon: <Activity size={32} />,
    title: "Trends & Insights",
    description: "Analyze spending patterns and optimize your budget.",
  },
  {
  icon: <Zap size={32} />,
  title: "FIRE number",
  description:
    "Easily calculate your Financial Independence number to plan your future smartly.",
},
];

export default function Features() {
  return (
    <section className="py-10 bg-gradient-to-t from-gray-100 to-gray-100 dark:from-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Smart Tools for Your Finances
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          All the tools you need to manage your money efficiently and securely.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl flex flex-col items-center text-center border border-transparent hover:border-emerald-500 dark:hover:border-emerald-400 transition"
            >
              <div className="text-emerald-500 dark:text-emerald-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
