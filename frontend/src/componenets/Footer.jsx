import {
  FaLinkedinIn,
  FaGithub,
  FaPinterest,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Brain, MailCheckIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-400 dark:border-gray-700 py-12 px-6 lg:px-16">
      
      {/* Columns */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-10 sm:gap-20 justify-between">

  {/* Column 1: About */}
  <div className="flex-1">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      FinanceTracker
    </h2>
    <p className="text-gray-700 dark:text-gray-300">
      Your all-in-one finance tracker. Manage expenses, dashboards, and reach your financial goals.
    </p>
  </div>

  {/* Column 2: Quick Links */}
  <div className="flex-1  ml-10">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Calculators
    </h3>
    <ul className="space-y-2">
      <li><a href="/fdcalculator" className="hover:text-emerald-500 transition">FD Calculator</a></li>
      <li><a href="/rdcalculator" className="hover:text-emerald-500 transition">RD Calculator</a></li>
      <li><a href="/sipcalculator" className="hover:text-emerald-500 transition">SIP Calculator</a></li>
      <li><a href="#/firesection" className="hover:text-emerald-500 transition">FIRE Calculator</a></li>
    </ul>
  </div>

  {/* Column 3: Social Media */}
  <div className="flex-1">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Connect with us
    </h3>
    <div className="flex gap-3 mt-2">
      {[{ icon: FaLinkedinIn, link: "#" },
        { icon: FaGithub, link: "#" },
        { icon: MailCheckIcon, link: "mailto:ankitagupta94161@gmail.com" },
        { icon: FaPinterest, link: "#" }].map((item, idx) => (
        <motion.a
          key={idx}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center"
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <item.icon className="w-5 h-5" />
        </motion.a>
      ))}
    </div>
  </div>

</div>


      {/* Bottom */}
      <div className="mt-10 border-t border-gray-400 dark:border-gray-700 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} FinanceTracker. All rights reserved. | Made
        with <Brain className="inline w-4 h-4 text-emerald-500 align-middle mx-1" /> by Ankita Gupta
      </div>

    </footer>
  );
}
