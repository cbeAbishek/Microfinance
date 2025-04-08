"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import "./page.css"


declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Profile() {
 
  return (
    <div className="relative min-h-screen bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      <Navbar />
      <br />
      <br />
      
    </div>
  )
}