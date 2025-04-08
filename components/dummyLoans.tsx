import { ethers } from "ethers";

// Define the Loan type
type Loan = {
  id: number;
  borrower: string;
  amount: bigint;
  duration: number;
  purpose: string;
  status: number;
  dueDate: number;
};

// Dummy data for loan applications
export const dummyLoans: Loan[] = [
    {
      id: 1,
      borrower: "0x1234567890abcdef1234567890abcdef12345678",
      amount: BigInt(ethers.parseEther("0.1")), // 1.5 ETH
      duration: 30, // 30 days
      purpose: "Medical bill payment",
      status: 0, // Pending
      dueDate: 0, // Not applicable for pending loans
    },
    {
      id: 2,
      borrower: "0x9876543210fedcba9876543210fedcba98765432",
      amount: BigInt(ethers.parseEther("0.75")), // 0.75 ETH
      duration: 15, // 15 days
      purpose: "Medical expenses",
      status: 1, // Approved
      dueDate: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60, // Due in 15 days
    },
    {
      id: 3,
      borrower: "0xabcdef1234567890abcdef1234567890abcdef12",
      amount: BigInt(ethers.parseEther("2.0")), // 2.0 ETH
      duration: 60, // 60 days
      purpose: "Education fees",
      status: 2, // Repaid
      dueDate: Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60, // Past due date
    },
    {
      id: 4,
      borrower: "0xfedcba9876543210fedcba9876543210fedcba98",
      amount: BigInt(ethers.parseEther("0.5")), // 0.5 ETH
      duration: 7, // 7 days
      purpose: "Emergency funds",
      status: 3, // Rejected
      dueDate: 0, // Not applicable for rejected loans
    },
  ];