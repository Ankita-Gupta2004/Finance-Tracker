import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { TrendingUp, Coins, Building, Bitcoin } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export default function InvestmentsSection() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to access your investments.</p>;

  const [stocks, setStocks] = useState([
    { id: crypto.randomUUID(), name: "", amount: "", units: "", type: "Large Cap" },
  ]);
  const [mfs, setMfs] = useState([
    { id: crypto.randomUUID(), name: "", amount: "", fundType: "Equity", category: "Large Cap" },
  ]);
  const [fds, setFds] = useState([{ id: crypto.randomUUID(), name: "", amount: "", tenure: "" }]);
  const [goldEtfs, setGoldEtfs] = useState([{ id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const [cryptos, setCryptos] = useState([{ id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const [reits, setReits] = useState([{ id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const [debtFunds, setDebtFunds] = useState([{ id: crypto.randomUUID(), name: "", amount: "", units: "" }]);

  // ------------------ CRUD HANDLERS ------------------
  const addStock = () =>
    setStocks([...stocks, { id: crypto.randomUUID(), name: "", amount: "", units: "", type: "Large Cap" }]);
  const removeStock = (id) => setStocks(stocks.filter((s) => s.id !== id));
  const handleStockChange = (id, field, value) =>
    setStocks(stocks.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const addMf = () =>
    setMfs([...mfs, { id: crypto.randomUUID(), name: "", amount: "", fundType: "Equity", category: "Large Cap" }]);
  const removeMf = (id) => setMfs(mfs.filter((m) => m.id !== id));
  const handleMfChange = (id, field, value) =>
    setMfs(mfs.map((m) => (m.id === id ? { ...m, [field]: value } : m)));

  const addFd = () => setFds([...fds, { id: crypto.randomUUID(), name: "", amount: "", tenure: "" }]);
  const removeFd = (id) => setFds(fds.filter((f) => f.id !== id));
  const handleFdChange = (id, field, value) =>
    setFds(fds.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const addGold = () => setGoldEtfs([...goldEtfs, { id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const removeGold = (id) => setGoldEtfs(goldEtfs.filter((g) => g.id !== id));
  const handleGoldChange = (id, field, value) =>
    setGoldEtfs(goldEtfs.map((g) => (g.id === id ? { ...g, [field]: value } : g)));

  const addCrypto = () => setCryptos([...cryptos, { id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const removeCrypto = (id) => setCryptos(cryptos.filter((c) => c.id !== id));
  const handleCryptoChange = (id, field, value) =>
    setCryptos(cryptos.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addReit = () => setReits([...reits, { id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const removeReit = (id) => setReits(reits.filter((r) => r.id !== id));
  const handleReitChange = (id, field, value) =>
    setReits(reits.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handleDebtChange = (id, field, value) =>
    setDebtFunds(debtFunds.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  const addDebt = () => setDebtFunds([...debtFunds, { id: crypto.randomUUID(), name: "", amount: "", units: "" }]);
  const removeDebt = (id) => setDebtFunds(debtFunds.filter((d) => d.id !== id));

  // Total Investments Calculation
  const totalInvestment =
    stocks.reduce((sum, s) => sum + (parseFloat(s.amount) || 0) * (parseFloat(s.units) || 0), 0) +
    mfs.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0) +
    fds.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0) +
    goldEtfs.reduce((sum, g) => sum + (parseFloat(g.amount) || 0) * (parseFloat(g.units) || 0), 0) +
    cryptos.reduce((sum, c) => sum + (parseFloat(c.amount) || 0) * (parseFloat(c.units) || 0), 0) +
    reits.reduce((sum, r) => sum + (parseFloat(r.amount) || 0) * (parseFloat(r.units) || 0), 0);

  // ------------------ PER-USER ENCRYPTED SAVE ------------------
  const handleSaveInvestments = () => {
    try {
      const formData = { stocks, mfs, fds, goldEtfs, cryptos, reits, debtFunds };
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(formData), SECRET_KEY).toString();
      localStorage.setItem(`investmentData_${user.uid}`, encrypted);
      alert("Your investments have been saved securely!");
    } catch (err) {
      console.error("Failed to save investments", err);
      alert("Failed to save investments.");
    }
  };

  // ------------------ LOAD PER-USER ENCRYPTED DATA ------------------
  useEffect(() => {
    const saved = localStorage.getItem(`investmentData_${user.uid}`);
    if (saved) {
      try {
        const bytes = CryptoJS.AES.decrypt(saved, SECRET_KEY);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setStocks(data.stocks || stocks);
        setMfs(data.mfs || mfs);
        setFds(data.fds || fds);
        setGoldEtfs(data.goldEtfs || goldEtfs);
        setCryptos(data.cryptos || cryptos);
        setReits(data.reits || reits);
        setDebtFunds(data.debtFunds || debtFunds);
      } catch (err) {
        console.error("Failed to decrypt investment data", err);
      }
    }
  }, [user]);



  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-100 dark:from-black dark:to-gray-900 min-h-screen">
      <Navbar />

      <section className="py-16 max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mt-12"
        >
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400/40 to-teal-400 rounded-full opacity-20 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
                    className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-tr from-teal-400/40 to-emerald-400 rounded-full opacity-20 blur-3xl"
                    animate={{
                      y: [0, 20, 0],
                      x: [0, -20, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Investments
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            "Track and manage your investments. Add stocks, mutual & debt funds, FDs,
            gold ETFs, crypto and REITs — save locally and analyze allocation."
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* SIP */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <ClipboardCheck className="w-12 h-12 text-emerald-600" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              SIP (Systematic Investment Plan)
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Invest a fixed amount regularly in mutual funds and build wealth
              through disciplined investing.
            </p>
          </div>

          {/* Lumpsum */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <PlusCircle className="w-12 h-12 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Lumpsum Investments
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Make one-time investments in mutual funds or stocks for long-term
              growth and portfolio diversification.
            </p>
          </div>

          {/* Debt Funds */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <TrendingUp className="w-12 h-12 text-yellow-600" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Debt Funds
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Invest in fixed-income instruments like bonds or treasury bills
              for stable returns and lower risk.
            </p>
          </div>

          {/* Gold ETF / Digital Gold */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <Coins className="w-12 h-12 text-amber-500" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Gold ETF / Digital Gold
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Gain exposure to gold prices digitally without worrying about
              storage or purity concerns.
            </p>
          </div>

          {/* REITs */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <Building className="w-12 h-12 text-purple-600" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              REITs (Real Estate Investment Trusts)
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Invest in real estate properties indirectly and earn rental income
              or capital appreciation.
            </p>
          </div>

          {/* Crypto */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
            <Bitcoin className="w-12 h-12 text-pink-600" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              Crypto
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
              Track your cryptocurrency holdings and stay updated with your
              digital asset portfolio performance.
            </p>
          </div>
        </div>

        {/* Forms: grouped with same card styling as GoalsPage */}
        <div className="space-y-10">
          {/* Stocks Card */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-4 border border-white dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Stocks
            </h3>
            {stocks.map((s) => (
              <div key={s.id} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Stock Name"
                  value={s.name}
                  onChange={(e) =>
                    handleStockChange(s.id, "name", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Current Value (₹)"
                  value={s.amount}
                  onChange={(e) =>
                    handleStockChange(s.id, "amount", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="No. of Units"
                  value={s.units || ""}
                  onChange={(e) =>
                    handleStockChange(s.id, "units", e.target.value)
                  }
                  className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <select
                  value={s.type}
                  onChange={(e) =>
                    handleStockChange(s.id, "type", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>Large Cap</option>
                  <option>Mid Cap</option>
                  <option>Small Cap</option>
                </select>
                {stocks.length > 1 && (
                  <button
                    onClick={() => removeStock(s.id)}
                    className="col-span-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addStock}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
            >
              <PlusCircle /> Add Stock
            </button>
          </div>

          {/* Mutual Funds Card */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-8 rounded-2xl shadow-lg space-y-4 border border-white dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mutual Funds
            </h3>
            {mfs.map((m) => (
              <div key={m.id} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Fund Name"
                  value={m.name}
                  onChange={(e) => handleMfChange(m.id, "name", e.target.value)}
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Invested till now (₹)"
                  value={m.amount}
                  onChange={(e) =>
                    handleMfChange(m.id, "amount", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <select
                  value={m.fundType}
                  onChange={(e) =>
                    handleMfChange(m.id, "fundType", e.target.value)
                  }
                  className="col-span-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>Fund</option>
                  <option>Equity</option>
                  <option>Debt</option>
                  <option>Hybrid</option>
                  <option>Corporate</option>
                  <option>Index</option>
                </select>
                <select
                  value={m.category}
                  onChange={(e) =>
                    handleMfChange(m.id, "category", e.target.value)
                  }
                  className="col-span-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option>Large Cap</option>
                  <option>Mid Cap</option>
                  <option>Small Cap</option>
                  <option>Flexi/Multicap</option>
                </select>
                {mfs.length > 1 && (
                  <button
                    onClick={() => removeMf(m.id)}
                    className="col-span-1 text-red-500 hover:text-red-600 flex justify-center"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addMf}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-2"
            >
              <PlusCircle /> Add Mutual Fund
            </button>
          </div>

          {/* FD section full width (like Mutual Funds) */}
          <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-white dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              FDs / RDs
            </h3>
            {fds.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-12 gap-3 items-center mb-3"
              >
                <input
                  type="text"
                  placeholder="Bank / Scheme"
                  value={f.name}
                  onChange={(e) => handleFdChange(f.id, "name", e.target.value)}
                  className="col-span-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={f.amount}
                  onChange={(e) =>
                    handleFdChange(f.id, "amount", e.target.value)
                  }
                  className="col-span-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Tenure (months)"
                  value={f.tenure}
                  onChange={(e) =>
                    handleFdChange(f.id, "tenure", e.target.value)
                  }
                  className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={f.interestRate || ""}
                  onChange={(e) =>
                    handleFdChange(f.id, "interestRate", e.target.value)
                  }
                  className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                {fds.length > 1 && (
                  <button
                    onClick={() => removeFd(f.id)}
                    className="col-span-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addFd}
              className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg"
            >
              <PlusCircle /> Add FD / RD
            </button>
          </div>

          {/* 2x2 grid: Debt Funds, Gold, Crypto, REITs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debt Funds */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-white dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Debt Funds
              </h3>
              {debtFunds.map((d) => (
                <div
                  key={d.id}
                  className="grid grid-cols-12 gap-3 items-center mb-3"
                >
                  <input
                    type="text"
                    placeholder="Debt Fund Name"
                    value={d.name}
                    onChange={(e) =>
                      handleDebtChange(d.id, "name", e.target.value)
                    }
                    className="col-span-5 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Current Value (₹)"
                    value={d.amount}
                    onChange={(e) =>
                      handleDebtChange(d.id, "amount", e.target.value)
                    }
                    className="col-span-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    value={d.units || ""}
                    onChange={(e) =>
                      handleDebtChange(d.id, "units", e.target.value)
                    }
                    className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {debtFunds.length > 1 && (
                    <button
                      onClick={() => removeDebt(d.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addDebt}
                className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg"
              >
                <PlusCircle /> Add Debt Fund
              </button>
            </div>

            {/* Gold ETF */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-white dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Gold ETF / Digital Gold
              </h3>
              {goldEtfs.map((g) => (
                <div
                  key={g.id}
                  className="grid grid-cols-12 gap-3 items-center mb-3"
                >
                  <input
                    type="text"
                    placeholder="Gold ETF / Digital Gold Name"
                    value={g.name}
                    onChange={(e) =>
                      handleGoldChange(g.id, "name", e.target.value)
                    }
                    className="col-span-5 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Current Value (₹)"
                    value={g.amount}
                    onChange={(e) =>
                      handleGoldChange(g.id, "amount", e.target.value)
                    }
                    className="col-span-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    value={g.units || ""}
                    onChange={(e) =>
                      handleGoldChange(g.id, "units", e.target.value)
                    }
                    className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {goldEtfs.length > 1 && (
                    <button
                      onClick={() => removeGold(g.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addGold}
                className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg"
              >
                <PlusCircle /> Add Gold ETF
              </button>
            </div>

            {/* Crypto */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-white dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Crypto
              </h3>
              {cryptos.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-12 gap-3 items-center mb-3"
                >
                  <input
                    type="text"
                    placeholder="Crypto Name"
                    value={c.name}
                    onChange={(e) =>
                      handleCryptoChange(c.id, "name", e.target.value)
                    }
                    className="col-span-5 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Current Value (₹)"
                    value={c.amount}
                    onChange={(e) =>
                      handleCryptoChange(c.id, "amount", e.target.value)
                    }
                    className="col-span-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    value={c.units || ""}
                    onChange={(e) =>
                      handleCryptoChange(c.id, "units", e.target.value)
                    }
                    className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {cryptos.length > 1 && (
                    <button
                      onClick={() => removeCrypto(c.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCrypto}
                className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg"
              >
                <PlusCircle /> Add Crypto
              </button>
            </div>

            {/* REITs */}
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-white dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                REITs
              </h3>
              {reits.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-12 gap-3 items-center mb-3"
                >
                  <input
                    type="text"
                    placeholder="REIT Name"
                    value={r.name}
                    onChange={(e) =>
                      handleReitChange(r.id, "name", e.target.value)
                    }
                    className="col-span-5 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Current Value (₹)"
                    value={r.amount}
                    onChange={(e) =>
                      handleReitChange(r.id, "amount", e.target.value)
                    }
                    className="col-span-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Units"
                    value={r.units || ""}
                    onChange={(e) =>
                      handleReitChange(r.id, "units", e.target.value)
                    }
                    className="col-span-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  {reits.length > 1 && (
                    <button
                      onClick={() => removeReit(r.id)}
                      className="col-span-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addReit}
                className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg"
              >
                <PlusCircle /> Add REIT
              </button>
            </div>
          </div>

          {/* Total Investment Summary & Save */}
          <div className="flex items-center justify-between">
            <div className="mt-2 p-4 bg-green-100 dark:bg-gray-900 rounded-lg text-left">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Total Investment: ₹{totalInvestment.toLocaleString()}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Calculated from all asset entries
              </p>
            </div>

            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={handleSaveInvestments}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition"
              >
                <ClipboardCheck /> Save Investments
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
