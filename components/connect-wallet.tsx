"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ConnectWalletProps {
  isConnected: boolean
  account: string | null
  onConnect: (account: string) => void
}

export function ConnectWallet({ isConnected, account, onConnect }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  async function connectWallet() {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      onConnect(address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  if (isConnected && account) {
    return (
      <Button variant="outline">
        {account.slice(0, 6)}...{account.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

