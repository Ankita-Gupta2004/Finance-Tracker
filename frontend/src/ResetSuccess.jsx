import { useEffect } from "react";
import React from "react";

export default function ResetSuccess() {
  useEffect(() => {
  // mark password as successfully reset
  localStorage.setItem("passwordResetDone", "true");
}, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="message bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          ✅ Password Successfully Reset
        </h2>
        <p className="text-gray-700">
          You can now go back to the previous tab and log in.
        </p>
      </div>
    </div>
  );
}
