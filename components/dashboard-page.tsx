"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function DashboardPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Microfinance Platform</h1>
          <button
            className={`px-4 py-2 rounded ${
              isConnected ? "bg-green-500 text-white" : "bg-blue-500 text-white"
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
                <form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Enter amount"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">
                    Submit
                  </button>
                </form>
              </div>

              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Your Loans</h2>
                <p className="mb-4">View and manage your current loans</p>
                {/* Loans list goes here */}
                <ul>
                  <li className="mb-2">Loan #1 - $500 - Pending</li>
                  <li className="mb-2">Loan #2 - $300 - Approved</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 border rounded shadow max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">
              Welcome to Microfinance Platform
            </h2>
            <p className="mb-4 text-center">
              This platform allows you to request and manage microloans on the
              blockchain.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={async () => {
                if (window.ethereum) {
                  const provider = new ethers.BrowserProvider(window.ethereum);
                  const accounts = await provider.send(
                    "eth_requestAccounts",
                    []
                  );
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
