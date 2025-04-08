"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import LoanRequestForm from "./loan-request-form";
import Navbar from "./Navbar";
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
    <div className="dashboard bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      <Navbar />
      <LoanRequestForm />
    </div>
  );
}
