"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { LoansList } from "./loans-list";
import { useRouter } from "next/navigation"
import Link from "next/link"

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function DashboardPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()

  const handleLoanClick = () => {
    router.push("/loan-request")
  }
  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Connection check failed:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-r from-blue-800 to-indigo-900 min-h-screen text-white">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Microfinance Platform</h1>
          <button
            className={`px-4 py-2 rounded ${isConnected ? "bg-green-500 text-white" : "bg-blue-500 text-white"
              }`}
            onClick={async () => {
              if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
                setIsConnected(true);
              }
            }}
          >
            {isConnected
              ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>

        {isConnected ? (
          <>
            <div className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold mb-2">User Stats</h2>
              <p>Account: {account}</p>
              {/* Add more user stats here */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Request a Loan</h2>
                <p className="mb-4">
                  Fill out the form to request a new microloan
                </p>
                {/* Loan request form goes here */}

                <Link href="/?popup=open">
                  <button className="
                  onClick={handleLoanClick}
                  px-4 py-2 bg-blue-500 text-white rounded">
                    Request a Loan
                  </button></Link>

              </div>

              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Your Loans</h2>
                <p className="mb-4">View and manage your current loans</p>
                {/* Loans list goes here */}
                <ul>
                  <LoansList account={account} />
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 border rounded-2xl shadow-lg max-w-md mx-auto mt-20 bg-white/10 backdrop-blur-md border-white/20 animate-fade-in transition-all duration-700">
            <h2 className="text-2xl font-bold text-center text-white mb-3">
              Welcome to Microfinance Platform
            </h2>
            <p className="mb-6 text-center text-/80">
              This platform allows you to request and manage microloans on the blockchain.
            </p>
            <button
              className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white rounded-xl font-semibold transition-transform duration-300 transform hover:scale-105"
              onClick={async () => {
                if (window.ethereum) {
                  const provider = new ethers.BrowserProvider(window.ethereum);
                  const accounts = await provider.send("eth_requestAccounts", []);
                  setAccount(accounts[0]);
                  setIsConnected(true);
                }
              }}
            >
              Connect Wallet
            </button>
          </div>

        )}
      </div>
    </div>
  );
}
