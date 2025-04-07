"use client"

import React, { useState } from "react"
import { ethers } from "ethers"

interface LoanRequestFormProps {
  account: string
}

export function LoanRequestForm({ account }: LoanRequestFormProps) {
  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [duration, setDuration] = useState("30")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Mock contract fetcher (you should replace this with your actual logic)
  async function getMicrofinanceContract() {
    // Replace this with actual provider and signer logic
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contractAddress = "0xYourContractAddress"
    const abi = [
      "function requestLoan(uint256 amount, uint256 duration, string calldata purpose) external"
    ]
    return new ethers.Contract(contractAddress, abi, signer)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (!amount || !purpose || !duration) {
      setMessage({ type: "error", text: "Please fill out all fields" })
      return
    }

    try {
      setIsSubmitting(true)

      const amountInWei = ethers.parseEther(amount)
      const durationInDays = parseInt(duration)

      const contract = await getMicrofinanceContract()
      const tx = await contract.requestLoan(amountInWei, durationInDays, purpose)

      setMessage({ type: "success", text: "Submitting your loan request..." })

      await tx.wait()

      setMessage({ type: "success", text: "Loan request confirmed on the blockchain." })

      setAmount("")
      setPurpose("")
      setDuration("30")
    } catch (error) {
      console.error("Error submitting loan request:", error)
      setMessage({ type: "error", text: "Failed to submit loan request." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center">Loan Request Form</h2>

      {message && (
        <div
          className={`text-sm p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col space-y-1">
        <label htmlFor="amount" className="font-medium">
          Loan Amount (ETH)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          className="p-2 border rounded"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="duration" className="font-medium">
          Duration (Days)
        </label>
        <input
          id="duration"
          type="number"
          min="1"
          max="365"
          className="p-2 border rounded"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="purpose" className="font-medium">
          Loan Purpose
        </label>
        <textarea
          id="purpose"
          rows={4}
          className="p-2 border rounded"
          placeholder="Describe the purpose of your loan"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Request Loan"}
      </button>
    </form>
  )
}
