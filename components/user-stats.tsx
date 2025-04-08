"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

// Props interface for the UserStats component
interface UserStatsProps {
  account: string; // Wallet address of the user
}

interface UserStats {
  balance: string;
  loanCount: number;
  creditScore: number;
  activeLoans: number;
  totalBorrowed: string;
  totalRepaid: string;
}

export function UserStats({ account }: UserStatsProps) {
  // State variables
  const [balance, setBalance] = useState<string>("0"); // ETH balance
  const [loanCount, setLoanCount] = useState<number>(0); // Number of loans
  const [creditScore, setCreditScore] = useState<number>(0); // Credit score
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  // Fetch user stats when the account changes
  useEffect(() => {
    if (account) {
      fetchUserStats();
    }
  }, [account]);

  const [stats, setStats] = useState<UserStats>({
    balance: "0",
    loanCount: 0,
    creditScore: 0,
    activeLoans: 0,
    totalBorrowed: "0",
    totalRepaid: "0",
  });

  useEffect(() => {
    if (account) {
      fetchUserStats();
    } else {
      setIsLoading(false);
    }
  }, [account]);


  if (!account) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connect Wallet
          </h2>
          <p className="text-gray-600">
            Please connect your wallet to view your statistics
          </p>
        </div>
      </div>
    );
  }

  // Function to get the microfinance contract instance
  async function getMicrofinanceContract() {
    try {
      // Connect to Ethereum provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Contract details
      const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28"; // Replace with your actual contract address
      const abi = [
        "function getUserLoanCount(address user) view returns (uint256)",
        "function getUserCreditScore(address user) view returns (uint256)",
      ];

      // Return contract instance
      return new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
      console.error("Error connecting to contract:", error);
      throw error;
    }
  }

  // Render loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="text-center text-gray-600">Loading user stats...</div>
    );
  }

  async function fetchUserStats() {
    setIsLoading(true);
    try {
      if (!window.ethereum || !account) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get ETH balance
      const balanceWei = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balanceWei);
      setBalance(formattedBalance);

      // Get contract instance
      const contract = await getMicrofinanceContract();

      // Fetch user's loan count and credit score
      const loanCountResult = await contract.getUserLoanCount(account);
      const creditScoreResult = await contract.getUserCreditScore(account);

      const loanCount = Number(loanCountResult);
      const creditScore = Number(creditScoreResult);

      // Initialize counters
      let activeLoans = 0;
      let totalBorrowed = ethers.parseEther("0");
      let totalRepaid = ethers.parseEther("0");

      // Loop through user's loans
      for (let i = 0; i < loanCount; i++) {
        const loan = await contract.getUserLoanAtIndex(account, i);
        if (loan.status === 1) {
          activeLoans++;
          totalBorrowed += loan.amount;
        } else if (loan.status === 2) {
          totalRepaid += loan.amount;
        }
      }

      // Update state (assuming you have a `setStats` object or individual setters)
      setStats({
        balance: formattedBalance,
        loanCount,
        creditScore,
        activeLoans,
        totalBorrowed: ethers.formatEther(totalBorrowed),
        totalRepaid: ethers.formatEther(totalRepaid),
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("Failed to fetch user statistics");
    } finally {
      setIsLoading(false);
    }
  }

  // Render user stats UI
  return (
    <div className="p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ETH Balance Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up">
          <h3 className="text-lg font-semibold mb-1">ETH Balance</h3>
          <p className="text-sm text-gray-500 mb-3">
            Your current wallet balance
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {Number.parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>

        {/* Loan Count Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up delay-100">
          <h3 className="text-lg font-semibold mb-1">Loan Count</h3>
          <p className="text-sm text-gray-500 mb-3">Total number of loans</p>
          <p className="text-3xl font-bold text-green-600">2</p>
        </div>

        {/* Credit Score Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up delay-200">
          <h3 className="text-lg font-semibold mb-1">Credit Score</h3>
          <p className="text-sm text-gray-500 mb-3">
            Your platform credit score
          </p>
          <p className="text-3xl font-bold text-purple-600">78</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Loan Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Borrowed</p>
              <p className="text-2xl font-bold text-blue-600">
                2.7500 ETH
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Repaid</p>
              <p className="text-2xl font-bold text-green-600">
                2.00 ETH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
