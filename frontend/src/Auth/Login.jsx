import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

// ✅ Custom Input
function Input({ type = "text", placeholder, className = "", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition ${className}`}
      {...props}
    />
  );
}

// ✅ Custom Button
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Check if email is verified
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        await auth.signOut(); // Sign out unverified user
        return;
      }

      alert("Login successful!");
      navigate("/"); // Redirect to home page

      // Optional: call your backend to sync user here
    } catch (err) {
      alert(err.message);
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
            Log In
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Log In
            </Button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
            Don't have an account?{" "}
            <a
              href="/createaccount"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
