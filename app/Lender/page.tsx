"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "./page.css";
import {
  HomeIcon,
  ClipboardListIcon,
  DollarSignIcon,
  EyeIcon,
  PlusCircleIcon,
  FileTextIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  UserCircleIcon,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "Requests", icon: ClipboardListIcon },
  { name: "Repayments", icon: DollarSignIcon },
  { name: "Monitoring", icon: EyeIcon },
  { name: "Add Fund", icon: PlusCircleIcon },
  { name: "Get Report", icon: FileTextIcon },
  { name: "Settings", icon: SettingsIcon },
];

function LenderDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loanRequests, setLoanRequests] = useState([
    { id: 1, name: "Account 1", amount: 1000, status: "Pending" },
    { id: 2, name: "Testing_ac", amount: 5000, status: "Pending" },
  ]);
  const [repayments, setRepayments] = useState([
    { id: 1, name: "Account 1", amount: 2000, dueDate: "2025-04-15" },
    { id: 2, name: "Account 1", amount: 5000, dueDate: "2025-04-20" },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Use admin/password.");
    }
  };

  const handleApprove = (id: number) => {
    setLoanRequests((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "Approved" } : loan
      )
    );
  };

  const handleReject = (id: number) => {
    setLoanRequests((prev) =>
      prev.map((loan) =>
        loan.id === id ? { ...loan, status: "Rejected" } : loan
      )
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
        {/* Moving stars background */}
        <div className="absolute inset-0 z-0 bg-white stars animate-starsMove opacity-40" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 opacity-70 animate-gradientFloat" />

        {/* Login Card */}
        <div className="relative z-10 w-[90%] max-w-md p-8 bg-white bg-opacity-20 rounded-2xl shadow-2xl backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
            Lender Login
          </h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 font-semibold text-white transition-transform bg-indigo-600 rounded hover:bg-indigo-700 hover:scale-105 shadow-md"
          >
            Login
          </button>
          {/* Sign Up Prompt */}
          <div className="mt-6 text-center text-sm text-gray-200">
            Don’t have an account?{" "}
            <a href="#" className="text-indigo-300 hover:underline">
              Sign up
            </a>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes starsMove {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 1000px 1000px;
            }
          }

          @keyframes gradientFloat {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .stars {
            background: url("https://www.transparenttextures.com/patterns/stardust.png");
            background-size: cover;
          }

          .animate-starsMove {
            animation: starsMove 60s linear infinite;
          }

          .animate-gradientFloat {
            background-size: 400% 400%;
            animation: gradientFloat 30s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-md z-20 w-64 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Lender Panel</h2>
          <nav className="space-y-4">
            {menuItems.map(({ name, icon: Icon }) => (
              <a
                key={name}
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded hover:bg-indigo-100"
              >
                <Icon className="w-5 h-5" />
                {name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav (Mobile) */}
        <div className="md:hidden bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Lender Dashboard</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Content */}
        <main className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Loan Requests */}
            <section className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl">
              <h2 className="text-3xl font-bold mb-8 text-slate-800 drop-shadow-sm">
                Loan Requests
                <span className="ml-2 text-blue-600 text-xl align-middle bg-blue-100 px-3 py-1 rounded-full">
                  {loanRequests.length} active
                </span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loanRequests.map((loan) => (
                  <motion.div
                    key={loan.id}
                    className="group p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/30"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                          <UserCircleIcon className="w-6 h-6 text-blue-500" />
                          {loan.name}
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                          ${loan.amount}
                          <span className="ml-2 text-sm font-normal text-slate-500">
                            USD
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          loan.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : loan.status === "Rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </div>

                    {loan.status === "Pending" && (
                      <motion.div
                        className="mt-6 flex gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <button
                          onClick={() => handleApprove(loan.id)}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(loan.id)}
                          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          Reject
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Repayments */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Repayments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repayments.map((repayment) => (
                  <motion.div
                    key={repayment.id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-bold">Name: {repayment.name}</p>
                    <p>Amount: ${repayment.amount}</p>
                    <p>Due Date: {repayment.dueDate}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default LenderDashboard;
