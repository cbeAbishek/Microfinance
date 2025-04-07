"use client";
import { useState } from 'react';
import { ethers } from 'ethers';
import MicrofinanceABI from '../contracts/Microfinance.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoanRequestForm() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      MicrofinanceABI.abi,
      signer
    );

    await contract.requestLoan(
      ethers.parseEther(amount),
      parseInt(duration),
      purpose
    );
  };

  return (
    <div className="loan-form">
      <input type="number" placeholder="Amount (ETH)" onChange={(e) => setAmount(e.target.value)} />
      <input type="number" placeholder="Duration (days)" onChange={(e) => setDuration(e.target.value)} />
      <textarea placeholder="Loan purpose" onChange={(e) => setPurpose(e.target.value)} />
      <button onClick={handleSubmit}>Request Loan</button>
    </div>
  );
}