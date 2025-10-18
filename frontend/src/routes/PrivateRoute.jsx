import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";

const financeTips = [
  "Track your expenses daily to save more effectively.",
  "Invest early to benefit from compound interest.",
  "Diversify your portfolio to reduce risk.",
  "Always maintain an emergency fund.",
  "Review your budget at the end of each month.",
  "Avoid high-interest debt whenever possible.",
  "Set financial goals and track progress regularly.",
];

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(
    Math.floor(Math.random() * financeTips.length)
  );

  // Rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % financeTips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
        {/* Hollow Spinner */}
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-emerald-200 dark:border-emerald-400 dark:border-t-emerald-200 rounded-full animate-spin mx-auto"></div>

        {/* Rotating Tip */}
        <p className="mt-6 text-center text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base max-w-md">
          {financeTips[tipIndex]}
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
