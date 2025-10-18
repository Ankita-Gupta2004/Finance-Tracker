import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-400 dark:border-gray-700 py-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Column 1: Logo + Description + Socials */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            FinanceTracker
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your all-in-one finance tracker. Manage expenses, dashboards, and
            reach your financial goals.
          </p>

          <div className="flex gap-3 mt-2">
            {[
              { icon: FaFacebookF, link: "https://facebook.com" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaInstagram, link: "https://instagram.com" },
              { icon: FaLinkedinIn, link: "https://linkedin.com" },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-500 hover:text-white transition"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#features" className="hover:text-emerald-500 transition">
                Features
              </a>
            </li>
            <li>
              <a
                href="#fire-calculator"
                className="hover:text-emerald-500 transition"
              >
                Calculators
              </a>
            </li>
            <li>
              <a
                href="#dashboard"
                className="hover:text-emerald-500 transition"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-emerald-500 transition">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-emerald-500 transition">
                Contact
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-emerald-500 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Newsletter / Contact */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Subscribe to get the latest updates and financial tips.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 border-t border-gray-400 dark:border-gray-700 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} FinanceTracker. All rights reserved. | Made
        with{" "}
        <Brain className="inline w-4 h-4 text-emerald-500 align-middle mx-1" />{" "}
        by Ankita Gupta
      </div>
    </footer>
  );
}
