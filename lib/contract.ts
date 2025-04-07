import { ethers } from "ethers"
import MicrofinanceABI from "@/contracts/Microfinance.json"

// Contract address will be updated after deployment
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

export async function getMicrofinanceContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  return new ethers.Contract(CONTRACT_ADDRESS, MicrofinanceABI.abi, signer)
}

