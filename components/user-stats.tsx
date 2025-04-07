"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"

interface UserStatsProps {
  account: string
}

export function UserStats({ account }: UserStatsProps) {
  const [balance, setBalance] = useState<string>("0")
  const [loanCount, setLoanCount] = useState<number>(0)
  const [creditScore, setCreditScore] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account) {
      fetchUserStats()
    }
  }, [account])

  async function getMicrofinanceContract() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28" // Replace with your actual contract address
    const abi = [
      "function getUserLoanCount(address user) view returns (uint256)",
      "function getUserCreditScore(address user) view returns (uint256)"
    ]
    return new ethers.Contract(contractAddress, abi, signer)
  }

  async function fetchUserStats() {
    try {
      setIsLoading(true)

      // Get ETH balance
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balanceWei = await provider.getBalance(account)
      setBalance(ethers.formatEther(balanceWei))

      // Get data from contract
      const contract = await getMicrofinanceContract()
      const loanCount = await contract.getUserLoanCount(account)
      const creditScore = await contract.getUserCreditScore(account)

      setLoanCount(Number(loanCount))
      setCreditScore(Number(creditScore))
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading user stats...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1">ETH Balance</h3>
        <p className="text-sm text-gray-500 mb-3">Your current wallet balance</p>
        <p className="text-2xl font-bold text-blue-600">{Number.parseFloat(balance).toFixed(4)} ETH</p>
      </div>

      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1">Loan Count</h3>
        <p className="text-sm text-gray-500 mb-3">Total number of loans</p>
        <p className="text-2xl font-bold text-green-600">{loanCount}</p>
      </div>

      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1">Credit Score</h3>
        <p className="text-sm text-gray-500 mb-3">Your platform credit score</p>
        <p className="text-2xl font-bold text-purple-600">{creditScore}</p>
      </div>
    </div>
  )
}
