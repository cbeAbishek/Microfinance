"use client";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MicrofinanceABI from '../contracts/Microfinance.json';

export default function AdminControls() {
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingLoans = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        MicrofinanceABI.abi,
        provider
      );

      const count = await contract.getLoanCount();
      const pending = [];
      for (let i = 0; i < count; i++) {
        const loan = await contract.getLoan(i);
        if (loan.status === 0) pending.push({ ...loan, id: i });
      }
      setPendingLoans(pending);
    };

    fetchPendingLoans();
  }, []);

  const approveLoan = async (loanId: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      MicrofinanceABI.abi,
      signer
    );

    await contract.approveLoan(loanId);
  };

  return (
    <div className="admin-panel">
      <h2>Pending Loans</h2>
      {pendingLoans.map(loan => (
        <div key={loan.id} className="loan-request">
          <p>{ethers.formatEther(loan.amount)} ETH - {loan.purpose}</p>
          <button onClick={() => approveLoan(loan.id)}>Approveing</button>
        </div>
      ))}
    </div>
  );
}