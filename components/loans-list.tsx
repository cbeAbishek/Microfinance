"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getMicrofinanceContract } from "@/lib/contract"

interface Loan {
  id: number
  amount: string
  duration: number
  purpose: string
  status: "Pending" | "Approved" | "Repaid" | "Rejected"
  dueDate: Date | null
}

interface LoansListProps {
  account: string
}

export function LoansList({ account }: LoansListProps) {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLoans()
  }, [account])

  async function fetchLoans() {
    try {
      setIsLoading(true)
      const contract = await getMicrofinanceContract()

      // This is a placeholder - the actual implementation would depend on your contract
      const loanCount = await contract.getUserLoanCount(account)
      const loanPromises = []

      for (let i = 0; i < loanCount; i++) {
        loanPromises.push(contract.getUserLoanAtIndex(account, i))
      }

      const loanResults = await Promise.all(loanPromises)

      const formattedLoans = loanResults.map((loan, index) => ({
        id: index,
        amount: ethers.formatEther(loan.amount),
        duration: loan.duration.toNumber(),
        purpose: loan.purpose,
        status: getLoanStatus(loan.status),
        dueDate: loan.dueDate ? new Date(loan.dueDate.toNumber() * 1000) : null,
      }))

      setLoans(formattedLoans)
    } catch (error) {
      console.error("Error fetching loans:", error)
      toast({
        title: "Failed to Load Loans",
        description: "There was an error loading your loans",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function getLoanStatus(statusCode: number): "Pending" | "Approved" | "Repaid" | "Rejected" {
    const statuses = ["Pending", "Approved", "Repaid", "Rejected"]
    return statuses[statusCode] as any
  }

  async function handleRepay(loanId: number) {
    try {
      const contract = await getMicrofinanceContract()
      const tx = await contract.repayLoan(loanId)

      toast({
        title: "Repayment Submitted",
        description: "Your loan repayment is being processed",
      })

      await tx.wait()

      toast({
        title: "Repayment Confirmed",
        description: "Your loan has been repaid successfully",
      })

      fetchLoans()
    } catch (error) {
      console.error("Error repaying loan:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to repay loan",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading your loans...</div>
  }

  if (loans.length === 0) {
    return <div>You don't have any loans yet.</div>
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{loan.amount} ETH</CardTitle>
              <Badge
                variant={
                  loan.status === "Approved"
                    ? "default"
                    : loan.status === "Repaid"
                      ? "success"
                      : loan.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                }
              >
                {loan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">{loan.purpose}</p>
            <p className="text-sm mt-1">Duration: {loan.duration} days</p>
            {loan.dueDate && <p className="text-sm mt-1">Due: {loan.dueDate.toLocaleDateString()}</p>}
          </CardContent>
          {loan.status === "Approved" && (
            <CardFooter>
              <Button onClick={() => handleRepay(loan.id)} className="w-full">
                Repay Loan
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

