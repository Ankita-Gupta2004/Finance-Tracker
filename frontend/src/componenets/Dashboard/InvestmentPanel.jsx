import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const InvestmentPanel = () => {
  const [investmentData, setInvestmentData] = useState({
    stocks: [],
    mfs: [],
    fds: [],
  });

  // Load investment data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("investmentData");
    if (saved) {
      setInvestmentData(JSON.parse(saved));
    }
  }, []);

  // Prepare data for Bar Chart
  const chartData = [
    {
      type: "Stocks",
      amount: investmentData.stocks.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    },
    {
      type: "Mutual Funds",
      amount: investmentData.mfs.reduce((sum, m) => sum + Number(m.amount || 0), 0),
    },
    {
      type: "FDs/RDs",
      amount: investmentData.fds.reduce((sum, f) => sum + Number(f.amount || 0), 0),
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
<CartesianGrid
              strokeDasharray="4 4"
              stroke="#bdbdbd"
              strokeOpacity={0.3}
            />          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Bar dataKey="amount" fill="#22C55E" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentPanel;
