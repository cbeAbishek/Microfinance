"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoanRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    duration: "30",
    purpose: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to request loans");
      }

      // Validate inputs
      if (!formData.amount || !formData.duration || !formData.purpose) {
        throw new Error("Please fill in all fields");
      }

      if (parseFloat(formData.amount) <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      if (parseInt(formData.duration) <= 0) {
        throw new Error("Duration must be greater than 0 days");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        require('../contracts/Microfinance.json').abi,
        signer
      );

      // Convert amount to Wei
      const amountInWei = ethers.parseEther(formData.amount);
      const durationInDays = parseInt(formData.duration);

      // Request the loan
      const tx = await contract.requestLoan(
        amountInWei,
        durationInDays,
        formData.purpose
      );

      toast.loading("Submitting loan request...");
      await tx.wait();
      
      toast.dismiss();
      toast.success("Loan request submitted successfully!");

      // Reset form
      setFormData({
        amount: "",
        duration: "30",
        purpose: ""
      });

    } catch (err: any) {
      console.error("Error requesting loan:", err);
      toast.error(err.message || "Failed to submit loan request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Request a Loan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (ETH)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full pr-12 sm:text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="0.00"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ETH</span>
            </div>
          </div>
        </div>

        {/* Duration Input */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Duration
          </label>
          <select
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            className="block w-full sm:text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required
          >
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="180">180 Days</option>
          </select>
        </div>

        {/* Purpose Input */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Purpose
          </label>
          <textarea
            name="purpose"
            id="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={3}
            className="block w-full sm:text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Describe the purpose of your loan..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg text-white font-medium
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
              transition-colors
              flex items-center space-x-2
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              'Request Loan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
