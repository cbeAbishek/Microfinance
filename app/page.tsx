"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardPage from "../components/dashboard-page"
import "./page.css"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    const popup = searchParams.get("popup")
    setIsPopupOpen(popup === "open")
  }, [searchParams])

  const openPopup = () => {
    router.push("?popup=open") // push query param
  }

  const closePopup = () => {
    router.push("/") // remove query param
  }

  return (
    <div className="relative min-h-screen">
      <DashboardPage />
    </div>
  )
}