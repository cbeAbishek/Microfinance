"use client";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MicrofinanceABI from '../contracts/Microfinance.json';

interface Loan {
  status: number;
  amount: bigint;
  purpose: string;
  dueDate: bigint;
}

export default function LoansList() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        MicrofinanceABI.abi,
        provider
      );
      
      const count = await contract.getLoanCount();
      const loans = [];
      for (let i = 0; i < count; i++) {
        loans.push(await contract.getLoan(i));
      }
      setLoans(loans);
    };

    fetchLoans();
  }, []);

  async function repayLoan(index: number): Promise<void> {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        MicrofinanceABI.abi,
        signer
      );

      const loan = loans[index];
      const tx = await contract.repayLoan(index, { value: loan.amount });
      await tx.wait();

      alert('Loan repaid successfully!');
      // Optionally, refresh the loans list
      const updatedLoans = [...loans];
      updatedLoans[index].status = 2; // Update status to "Repaid"
      setLoans(updatedLoans);
    } catch (error) {
      console.error('Error repaying loan:', error);
      alert('Failed to repay the loan. Please try again.');
    }
  }

  return (
    <div className="loans-list">
      {loans.map((loan, index) => (
        <div key={index} className="loan-card">
          <h3>{loan.purpose}</h3>
          <p>Amount: {ethers.formatEther(loan.amount)} ETH</p>
          <p>Status: {["Pending", "Approved", "Repaid", "Rejected"][loan.status]}</p>
          {loan.status === 1 && (
            <button onClick={() => repayLoan(index)}>
              Repay {ethers.formatEther(loan.amount)} ETH
            </button>
          )}
        </div>
      ))}
    </div>
  );
}