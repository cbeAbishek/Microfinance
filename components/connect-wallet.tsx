"use client";
// Simple MetaMask connection using ethers.js
import { useState } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet() {
  const [account, setAccount] = useState<string>('');

  const connect = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account.slice(0,6)}...{account.slice(-4)}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}