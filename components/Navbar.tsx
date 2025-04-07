"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkWalletConnection();
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setAccount(await accounts[0].getAddress());
          setIsConnected(true);
        } else {
          setIsConnected(false);
          setAccount(null);
        }
      } else {
        console.error("Ethereum wallet not detected.");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        alert("Ethereum wallet not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:", chainId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-blue-600">MicroFinance</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Loans
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Profile
            </a>
            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
                isConnected ? "bg-blue-800" : ""
              }`}
              onClick={connectWallet}
            >
              {isConnected
                ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
