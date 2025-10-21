import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import { auth } from "../firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setVerifiedEmail(email);
      } catch (error) {
        alert("Invalid or expired reset link.");
      } finally {
        setLoading(false);
      }
    };
    verifyCode();
  }, [oobCode]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      alert("Password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="text-center mt-20">Verifying link...</p>;

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
            Reset Password
          </h2>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Reset Password
            </button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
            Resetting for: <b>{verifiedEmail}</b>
          </p>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
