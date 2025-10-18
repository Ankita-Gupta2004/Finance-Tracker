import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const InvestmentPanel = () => {
  const { user, loading } = useAuth();
  const [investmentData, setInvestmentData] = useState({
    stocks: [],
    mfs: [],
    fds: [],
    goldEtfs: [],
    cryptos: [],
    reits: [],
    debtFunds: [],
  });

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your investment chart.</p>;

  // Load per-user encrypted data
  useEffect(() => {
    const saved = localStorage.getItem(`investmentData_${user.uid}`);
    if (saved) {
      try {
        const bytes = CryptoJS.AES.decrypt(saved, SECRET_KEY);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setInvestmentData(data);
      } catch (err) {
        console.error("Failed to decrypt investment data", err);
      }
    }
  }, [user]);

  // Prepare data for Bar Chart
  const chartData = [
    {
      type: "Stocks",
      amount: investmentData.stocks.reduce(
        (sum, s) =>
          sum + (parseFloat(s.amount) || 0) * (parseFloat(s.units) || 1), // use 1 if units missing
        0
      ),
    },
    {
      type: "Mutual Funds",
      amount: investmentData.mfs.reduce(
        (sum, m) => sum + (parseFloat(m.amount) || 0),
        0
      ),
    },
    {
      type: "FDs/RDs",
      amount: investmentData.fds.reduce(
        (sum, f) => sum + (parseFloat(f.amount) || 0),
        0
      ),
    },
    {
      type: "Gold ETF",
      amount: investmentData.goldEtfs.reduce(
        (sum, g) =>
          sum + (parseFloat(g.amount) || 0) * (parseFloat(g.units) || 1),
        0
      ),
    },
    {
      type: "Crypto",
      amount: investmentData.cryptos.reduce(
        (sum, c) =>
          sum + (parseFloat(c.amount) || 0) * (parseFloat(c.units) || 1),
        0
      ),
    },
    {
      type: "REITs",
      amount: investmentData.reits.reduce(
        (sum, r) =>
          sum + (parseFloat(r.amount) || 0) * (parseFloat(r.units) || 1),
        0
      ),
    },
    {
      type: "Debt Funds",
      amount: investmentData.debtFunds.reduce(
        (sum, d) =>
          sum + (parseFloat(d.amount) || 0) * (parseFloat(d.units) || 1),
        0
      ),
    },
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData.map((item) => ({
            type: item.type || "", // Ensure X-axis label is always string
            amount: item.amount || 0,
          }))}
          margin={{ top: 20, right: 20, left: 0, bottom: 40 }} // extra bottom for labels
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#bdbdbd"
            strokeOpacity={0.3}
          />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 12 }}
            interval={0} // show all labels
            angle={-15} // tilt if labels overlap
            textAnchor="end"
          />
          <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
          <Tooltip
            formatter={(value) => `₹${Number(value).toLocaleString()}`}
          />
          <Bar dataKey="amount" fill="#22C55E" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentPanel;
