"use client"

import type React from "react"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getMicrofinanceContract } from "@/lib/contract"

interface LoanRequestFormProps {
  account: string
}

export function LoanRequestForm({ account }: LoanRequestFormProps) {
  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [duration, setDuration] = useState("30")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!amount || !purpose || !duration) {
      toast({
        title: "Missing fields",
        description: "Please fill out all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const amountInWei = ethers.parseEther(amount)
      const durationInDays = Number.parseInt(duration)

      const contract = await getMicrofinanceContract()
      const tx = await contract.requestLoan(amountInWei, durationInDays, purpose)

      toast({
        title: "Loan Request Submitted",
        description: "Your loan request is being processed",
      })

      await tx.wait()

      toast({
        title: "Loan Request Confirmed",
        description: "Your loan request has been confirmed on the blockchain",
      })

      // Reset form
      setAmount("")
      setPurpose("")
      setDuration("30")
    } catch (error) {
      console.error("Error submitting loan request:", error)
      toast({
        title: "Transaction Failed",
        description: "Failed to submit loan request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Loan Amount (ETH)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (Days)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="365"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Loan Purpose</Label>
        <Textarea
          id="purpose"
          placeholder="Describe the purpose of your loan"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Loan"}
      </Button>
    </form>
  )
}

