"use client";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

interface UserStatsProps {
  account: string | null;
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
  const [stats, setStats] = useState<UserStats>({
    balance: '0',
    loanCount: 0,
    creditScore: 0,
    activeLoans: 0,
    totalBorrowed: '0',
    totalRepaid: '0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchUserStats();
    } else {
      setIsLoading(false);
    }
  }, [account]);

  const fetchUserStats = async () => {
    try {
      if (!window.ethereum || !account) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        require('../contracts/Microfinance.json').abi,
        provider
      );

      // Fetch user's balance
      const balance = await provider.getBalance(account);

      // Fetch user's loan count
      const loanCount = await contract.getUserLoanCount(account);

      // Fetch credit score
      const creditScore = await contract.getUserCreditScore(account);

      // Calculate active loans and total amounts
      let activeLoans = 0;
      let totalBorrowed = ethers.parseEther("0");
      let totalRepaid = ethers.parseEther("0");

      // Fetch all user loans
      for (let i = 0; i < Number(loanCount); i++) {
        const loan = await contract.getUserLoanAtIndex(account, i);
        if (loan.status === 1) { // Approved status
          activeLoans++;
          totalBorrowed += loan.amount;
        } else if (loan.status === 2) { // Repaid status
          totalRepaid += loan.amount;
        }
      }

      setStats({
        balance: ethers.formatEther(balance),
        loanCount: Number(loanCount),
        creditScore: Number(creditScore),
        activeLoans,
        totalBorrowed: ethers.formatEther(totalBorrowed),
        totalRepaid: ethers.formatEther(totalRepaid)
      });
    } catch (err) {
      console.error("Error fetching user stats:", err);
      toast.error("Failed to fetch user statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view your statistics</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* ETH Balance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">ETH Balance</h2>
        <p className="text-3xl font-bold text-blue-600">{Number(stats.balance).toFixed(4)} ETH</p>
        <p className="text-sm text-gray-500 mt-2">Your current wallet balance</p>
      </div>

      {/* Loan Count & Active Loans */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loan Count</h2>
        <p className="text-3xl font-bold text-green-600">{stats.loanCount}</p>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-500">Active Loans: {stats.activeLoans}</p>
          <p className="text-sm text-gray-500">Completed: {stats.loanCount - stats.activeLoans}</p>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Credit Score</h2>
        <p className="text-3xl font-bold text-purple-600">{stats.creditScore}</p>
        <p className="text-sm text-gray-500 mt-2">Your platform credit score</p>
      </div>

      {/* Loan Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 md:col-span-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Total Borrowed</p>
            <p className="text-2xl font-bold text-blue-600">{Number(stats.totalBorrowed).toFixed(4)} ETH</p>
          </div>
          <div>
            <p className="text-gray-600">Total Repaid</p>
            <p className="text-2xl font-bold text-green-600">{Number(stats.totalRepaid).toFixed(4)} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}