import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";

const AccountPanelBottom = () => {
  const [lastModified, setLastModified] = useState(
    localStorage.getItem("lastModified")
  );

  // Optional: auto-update every second to keep it fresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastModified(localStorage.getItem("lastModified"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center text-xs sm:text-sm text-white/70 dark:text-gray-300 mt-4 space-y-2 tracking-wide">
      <p className="flex justify-center items-center gap-1">
        <Calendar className="w-4 h-4 text-white/80 dark:text-gray-300" />
        <span className="font-medium">Month:</span>
        <span>{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</span>
      </p>
      <p className="flex flex-col justify-center items-center gap-1">
  <div className="flex items-center gap-1">
    <Clock className="w-4 h-4 text-white/80 dark:text-gray-300" />
    <span className="font-medium">Last Modified:</span>
  </div>
  <span>
    {lastModified
      ? new Date(lastModified).toLocaleString()
      : "N/A"}
  </span>
</p>

    </div>
  );
};

export default AccountPanelBottom;
