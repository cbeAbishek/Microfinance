"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Props interface for the UserStats component
interface UserStatsProps {
  account: string; // Wallet address of the user
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

  // Function to fetch user stats (ETH balance, loan count, credit score)
  async function fetchUserStats() {
    setIsLoading(true);

    try {
      // Get ETH balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balanceWei);
      setBalance(formattedBalance);

      // Get data from the smart contract
      const contract = await getMicrofinanceContract();
      const loanCountResult = await contract.getUserLoanCount(account);
      const creditScoreResult = await contract.getUserCreditScore(account);

      // Update state with fetched data
      setLoanCount(Number(loanCountResult));
      setCreditScore(Number(creditScoreResult));
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Render loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="text-center text-gray-600">
        Loading user stats...
      </div>
    );
  }

  // Render user stats UI
  return (
    <div className="p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ETH Balance Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up">
          <h3 className="text-lg font-semibold mb-1">ETH Balance</h3>
          <p className="text-sm text-gray-500 mb-3">Your current wallet balance</p>
          <p className="text-3xl font-bold text-blue-600">
            {Number.parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>

        {/* Loan Count Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up delay-100">
          <h3 className="text-lg font-semibold mb-1">Loan Count</h3>
          <p className="text-sm text-gray-500 mb-3">Total number of loans</p>
          <p className="text-3xl font-bold text-green-600">{loanCount}</p>
        </div>

        {/* Credit Score Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border animate-fade-in-up delay-200">
          <h3 className="text-lg font-semibold mb-1">Credit Score</h3>
          <p className="text-sm text-gray-500 mb-3">Your platform credit score</p>
          <p className="text-3xl font-bold text-purple-600">{creditScore}</p>
        </div>
      </div>
    </div>
  );
}