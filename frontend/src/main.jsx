import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import "./index.css";

// Pages
import App from "./App.jsx";
import ExpensesPage from "./componenets/Expense/ExpensePage.jsx";
import GoalsPage from "./componenets/GoalsPage/GoalsPage.jsx";
import FDCalculator from "./componenets/Calculators/FDCalculator.jsx";
import RDCalculator from "./componenets/Calculators/RDCalculator.jsx";
import SIPCalculator from "./componenets/Calculators/SIPCalculator.jsx";
import CreateAccount from "./Auth/CreateAccount.jsx";
import Login from "./Auth/Login.jsx";
import AssetsCard from "./componenets/Assests/AssetsCard.jsx";
import Report from "./componenets/Report/Report.jsx";
import InvestmentsSection from "./componenets/Expense/InvestmentsSection.jsx";
import Dashboard from "./componenets/Dashboard/Dashboard.jsx";
// Routes
import PrivateRoute from "./routes/PrivateRoute.jsx";

import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fdcalculator" element={<FDCalculator />} />
          <Route path="/rdcalculator" element={<RDCalculator />} />
          <Route path="/sipcalculator" element={<SIPCalculator />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />


          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenseform"
            element={
              <PrivateRoute>
                <ExpensesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/goalspage"
            element={
              <PrivateRoute>
                <GoalsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assetscard"
            element={
              <PrivateRoute>
                <AssetsCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/investmentssection"
            element={
              <PrivateRoute>
                <InvestmentsSection />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

