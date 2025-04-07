"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMicrofinanceContract } from "@/lib/contract"

interface UserStatsProps {
  account: string
}

export function UserStats({ account }: UserStatsProps) {
  const [balance, setBalance] = useState<string>("0")
  const [loanCount, setLoanCount] = useState<number>(0)
  const [creditScore, setCreditScore] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserStats()
  }, [account])

  async function fetchUserStats() {
    try {
      setIsLoading(true)

      // Get ETH balance
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balanceWei = await provider.getBalance(account)
      setBalance(ethers.formatEther(balanceWei))

      // Get contract data
      const contract = await getMicrofinanceContract()

      // These calls would depend on your actual contract implementation
      const loanCount = await contract.getUserLoanCount(account)
      setLoanCount(Number(loanCount))

      const creditScore = await contract.getUserCreditScore(account)
      setCreditScore(Number(creditScore))
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading user stats...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>ETH Balance</CardTitle>
          <CardDescription>Your current wallet balance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{Number.parseFloat(balance).toFixed(4)} ETH</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Loan Count</CardTitle>
          <CardDescription>Total number of loans</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{loanCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Credit Score</CardTitle>
          <CardDescription>Your platform credit score</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{creditScore}</p>
        </CardContent>
      </Card>
    </div>
  )
}

