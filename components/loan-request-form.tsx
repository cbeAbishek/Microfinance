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
  const [duration, setDuration] = useState("30"); // Default duration set to 30 days
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getMicrofinanceContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28"; // Replace with your contract address
    const abi = [
      "function requestLoan(uint256 amount, uint256 duration, string calldata purpose) external",
    ];
    return new ethers.Contract(contractAddress, abi, signer);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null); // Clear any previous messages

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

      const amountInWei = ethers.parseEther(amount); // Convert ETH to Wei
      const durationInDays = parseInt(duration);

      const contract = await getMicrofinanceContract();
      const tx = await contract.requestLoan(
        amountInWei,
        durationInDays,
        purpose
      );

      setMessage({ type: "success", text: "Submitting your loan request..." });

      await tx.wait(); // Wait for the transaction to be mined

      setMessage({
        type: "success",
        text: "Loan request confirmed on the blockchain.",
      });

      // Reset form fields
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
      setIsSubmitting(false); // Ensure the submit button is re-enabled
    }
  }

  return (
    <div className="loan-form">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Loan purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Request Loan"}
        </button>
      </form>
      {message && (
        <p
          className={`message ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
