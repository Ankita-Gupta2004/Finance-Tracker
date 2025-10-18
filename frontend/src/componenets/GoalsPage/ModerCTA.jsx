import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ModernCTA() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black/10 dark:to-gray-900 py-8 px-4 lg:px-16">
      <section className="relative bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl overflow-hidden p-10 lg:p-16">
        {/* Animated background circles */}
        <motion.div
          className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-white/10 rounded-full animate-spin-slow"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[-100px] right-[-80px] w-72 h-72 bg-white/20 rounded-full animate-spin-reverse"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Take Control of Your Financial Goals
          </motion.h2>

          <motion.p
            className="text-white/90 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Plan, track, and achieve your short-term, mid-term, and long-term goals effectively. Start your financial journey today!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            <a
              href="/assetscard"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 font-semibold px-6 py-4 rounded-full shadow-lg hover:bg-white/90 transition"
            >
              Enter Your Assets 
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center gap-3 border border-white text-white font-semibold px-6 py-4 rounded-full shadow-lg hover:bg-white hover:text-emerald-700 transition"
            >
              Learn More
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
