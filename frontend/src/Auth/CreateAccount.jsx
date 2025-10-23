import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Update display name in Firebase
    await updateProfile(user, { displayName: name });

    // 3️⃣ Send user info to your backend (MongoDB)
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        email, 
        uid: user.uid  // optional: store Firebase uid in MongoDB
      }),
    });

    // 4️⃣ Send email verification
    await sendEmailVerification(user);

    // 5️⃣ Sign out the user immediately
    await auth.signOut();

    alert("Verification email sent! Please verify your email before logging in.");

    // 6️⃣ Redirect to login page
    navigate("/login");
  } catch (err) {
    console.error(err);
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
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
