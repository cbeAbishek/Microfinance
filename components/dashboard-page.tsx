"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { UserStats } from "./user-stats";
import LoanRequestForm from "./loan-request-form";
import LoansList from "./loans-list";
import { toast } from "react-hot-toast";

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
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", () => window.location.reload());
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this application");
        setIsLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const address = await accounts[0].getAddress();
        setAccount(address);
        setIsConnected(true);
      } else {
        setIsConnected(false);
        setAccount(null);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      toast.error("Failed to connect to wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const address = await accounts[0];
      setAccount(address);
      setIsConnected(true);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this application");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setAccount(address);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to MicroFinance</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to start managing your loans</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <UserStats account={account} />
          <div className="mt-8">
            <LoanRequestForm />
          </div>
          <div className="mt-8">
            <LoansList account={account} />
          </div>
        </div>
      )}
    </div>
  );
}
