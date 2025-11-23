import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const AccountPanelBottom = () => {
  const { user } = useAuth();
  const [lastModified, setLastModified] = useState(null);

  // Optional: auto-update every second to keep it fresh
  useEffect(() => {
    const parseRaw = (raw) => {
      if (!raw) return null;
      // plain ISO
      if (!Number.isNaN(Date.parse(raw))) return raw;
      // try decrypt
      try {
        const dec = CryptoJS.AES.decrypt(raw, SECRET_KEY).toString(
          CryptoJS.enc.Utf8
        );
        if (!Number.isNaN(Date.parse(dec))) return dec;
      } catch (e) {}
      return null;
    };

    const getRaw = () => {
      if (user?.uid) {
        return (
          localStorage.getItem(`lastModified_${user.uid}`) ||
          localStorage.getItem("lastModified")
        );
      }
      return localStorage.getItem("lastModified");
    };

    const update = () => {
      const parsed = parseRaw(getRaw());
      setLastModified(parsed);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  return (
    <div className="w-full text-center text-xs sm:text-sm text-white/70 dark:text-gray-300 mt-4 space-y-2 tracking-wide">
      <p className="flex justify-center items-center gap-1">
        <Calendar className="w-4 h-4 text-white/80 dark:text-gray-300" />
        <span className="font-medium">Month:</span>
        <span>
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </p>
      <p className="flex flex-col justify-center items-center gap-1">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-white/80 dark:text-gray-300" />
          <span className="font-medium">Last Modified:</span>
        </div>
        <span>
          {lastModified ? new Date(lastModified).toLocaleString() : "N/A"}
        </span>
      </p>
    </div>
  );
};

export default AccountPanelBottom;
