import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <div className="bg-gradient-to-t from-white to-gray-100 dark:from-black dark:to-gray-900 py-8 px-4 lg:px-16">
      <section className="relative py-18 bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl overflow-hidden">
        {/* Optional animated background circles */}
        <motion.div
          className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/10 rounded-full animate-spin-slow"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[-120px] right-[-80px] w-72 h-72 bg-white/20 rounded-full animate-spin-reverse"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Take Control of Your Finances Today
          </motion.h2>

          <motion.p
            className="text-white/90 max-w-2xl mx-auto mb-8 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Track your expenses, analyze reports, set budgets, and calculate important metrics like FD, RD, SIP and FIRE numbers. 
            Everything you need to plan your financial future, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <a
              href="/fdcalculator"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 font-semibold px-6 py-4 rounded-full shadow-lg hover:bg-white/90 transition"
            >
              Open Calculators
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.p
            className="mt-6 text-white/80 text-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            No more guesswork — visualize your finances and take smarter decisions today.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
