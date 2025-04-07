"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"

declare let window: any

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
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (account) {
      fetchLoans()
    }
  }, [account])

  async function getMicrofinanceContract() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28" // Replace with your contract address
    const abi = [ 
      // Add relevant contract ABI functions used below
      "function getUserLoanCount(address user) view returns (uint256)",
      "function getUserLoanAtIndex(address user, uint256 index) view returns (tuple(uint256 amount, uint256 duration, string purpose, uint8 status, uint256 dueDate))",
      "function repayLoan(uint256 loanId) public",
    ]
    return new ethers.Contract(contractAddress, abi, signer)
  }

  async function fetchLoans() {
    try {
      setIsLoading(true);
      setMessage(""); // Clear any previous messages
      const contract = await getMicrofinanceContract();
      const loanCount = Number(await contract.getUserLoanCount(account)); // Ensure loanCount is a number

      if (loanCount === 0) {
        setLoans([]); // No loans to display
        setMessage("You don't have any loans yet.");
        return;
      }

      const loanPromises = [];
      for (let i = 0; i < loanCount; i++) {
        loanPromises.push(contract.getUserLoanAtIndex(account, i));
      }

      const loanResults = await Promise.all(loanPromises);

      const formattedLoans = loanResults.map((loan: any, index: number) => ({
        id: index,
        amount: ethers.formatEther(loan[0]),
        duration: Number(loan[1]),
        purpose: loan[2],
        status: getLoanStatus(Number(loan[3])),
        dueDate: loan[4] ? new Date(Number(loan[4]) * 1000) : null,
      }));

      setLoans(formattedLoans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setMessage("Error loading your loans. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading state is updated
    }
  }

  function getLoanStatus(statusCode: number): "Pending" | "Approved" | "Repaid" | "Rejected" {
    const statuses = ["Pending", "Approved", "Repaid", "Rejected"]
    return statuses[statusCode] as "Pending" | "Approved" | "Repaid" | "Rejected"
  }

  async function handleRepay(loanId: number) {
    try {
      setMessage("Processing repayment...")
      const contract = await getMicrofinanceContract()
      const tx = await contract.repayLoan(loanId)
      await tx.wait()
      setMessage("Loan repaid successfully.")
      fetchLoans()
    } catch (error) {
      console.error("Error repaying loan:", error)
      setMessage("Failed to repay loan.")
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-gray-100">Loading your loans...</p>
      ) : loans.length === 0 ? (
        <p className="text-gray-100">You don't have any loans yet.</p>
      ) : (
        loans.map((loan) => (
          <div key={loan.id} className="border rounded-lg shadow-sm p-4 bg-white">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{loan.amount} ETH</h3>
              <span
                className={`px-2 py-1 text-sm rounded-full ${
                  loan.status === "Approved"
                    ? "bg-blue-100 text-blue-700"
                    : loan.status === "Repaid"
                    ? "bg-green-100 text-green-700"
                    : loan.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {loan.status}
              </span>
            </div>
            <p className="text-sm mt-2 text-gray-700">{loan.purpose}</p>
            <p className="text-sm mt-1 text-gray-600">Duration: {loan.duration} days</p>
            {loan.dueDate && (
              <p className="text-sm mt-1 text-gray-600">Due: {loan.dueDate.toLocaleDateString()}</p>
            )}
            {loan.status === "Approved" && (
              <button
                onClick={() => handleRepay(loan.id)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
              >
                Repay Loan
              </button>
            )}
          </div>
        ))
      )}
      {message && <p className="text-sm text-center text-gray-700">{message}</p>}
    </div>
  )
}
