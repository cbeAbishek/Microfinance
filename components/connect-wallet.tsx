"use client"

import { useState } from "react"
import { ethers } from "ethers"

interface ConnectWalletProps {
  isConnected: boolean
  account: string | null
  onConnect: (account: string) => void
}

export function ConnectWallet({ isConnected, account, onConnect }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function connectWallet() {
    if (!window.ethereum) {
      setErrorMessage("MetaMask not found. Please install MetaMask to use this application.")
      return
    }

    try {
      setIsConnecting(true)
      setErrorMessage(null)

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      onConnect(address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setErrorMessage("Failed to connect to your wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {isConnected && account ? (
        <button
          disabled
          className="bg-white border border-gray-300 text-gray-800 font-medium py-2 px-4 rounded shadow-sm cursor-default"
        >
          {account.slice(0, 6)}...{account.slice(-4)}
        </button>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
    </div>
  )
}
