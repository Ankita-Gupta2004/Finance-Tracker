import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email, {
        url: import.meta.env.VITE_PASSWORD_RESET_URL,
      });

      alert("Password reset email sent! Check your inbox (or spam).");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 px-4"
      >
        <div className="w-full max-w-md bg-gradient-to-t from-white to-white dark:from-black/10 dark:to-gray-900 shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleResetRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
