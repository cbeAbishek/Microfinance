"use client";
import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoanRequestForm() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getMicrofinanceContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28";
    const abi = [
      "function requestLoan(uint256 amount, uint256 duration, string calldata purpose) external",
    ];
    return new ethers.Contract(contractAddress, abi, signer);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!amount || !purpose || !duration) {
      setMessage({ type: "error", text: "Please fill out all fields." });
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid loan amount greater than 0.",
      });
      return;
    }

    if (
      isNaN(Number(duration)) ||
      Number(duration) <= 0 ||
      Number(duration) > 365
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid duration between 1 and 365 days.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const amountInWei = ethers.parseEther(amount);
      const durationInDays = parseInt(duration);

      const contract = await getMicrofinanceContract();
      const tx = await contract.requestLoan(amountInWei, durationInDays, purpose);

      setMessage({ type: "success", text: "Submitting your loan request..." });

      await tx.wait();

      setMessage({
        type: "success",
        text: "Loan request confirmed on the blockchain.",
      });

      setAmount("");
      setPurpose("");
      setDuration("30");
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setMessage({
        type: "error",
        text: "Failed to submit loan request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Request a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Loan purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Request Loan"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.type === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
