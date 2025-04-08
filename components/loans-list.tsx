import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { dummyLoans } from "./dummyLoans"; // Import dummy data

interface LoansListProps {
  account: string | null;
}

interface Loan {
  id: number;
  borrower: string;
  amount: bigint;
  duration: number;
  purpose: string;
  status: number;
  dueDate: number;
}

export default function LoansList({ account }: LoansListProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account) {
      // Use dummy data instead of fetching from the contract
      setTimeout(() => {
        setLoans(dummyLoans);
        setIsLoading(false);
      }, 1000); // Simulate a 1-second loading delay
    } else {
      setIsLoading(false);
    }
  }, [account]);

  const getLoanStatus = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "text-yellow-600", bg: "bg-yellow-100" };
      case 1:
        return { text: "Approved", color: "text-green-600", bg: "bg-green-100" };
      case 2:
        return { text: "Repaid", color: "text-blue-600", bg: "bg-blue-100" };
      case 3:
        return { text: "Rejected", color: "text-red-600", bg: "bg-red-100" };
      default:
        return { text: "Unknown", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  if (!account) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Loans</h2>
        <p className="text-gray-600">You haven't taken any loans yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Loans</h2>
      <div className="space-y-4">
        {loans.map((loan) => {
          const status = getLoanStatus(loan.status);
          return (
            <div
              key={loan.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {ethers.formatEther(loan.amount)} ETH
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {loan.duration} days
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Purpose</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {loan.purpose}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${status.bg} ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>
              </div>
              {loan.status === 1 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(loan.dueDate * 1000).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}