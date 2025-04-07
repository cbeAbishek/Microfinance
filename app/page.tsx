"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardPage from "../components/dashboard-page"
import "./page.css"
import { LoanRequestForm } from "../components/loan-request-form"

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

      <button
        onClick={openPopup}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow-md"
      >
        Open Popup
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={closePopup}
            >
              &times;
            </button>
            <LoanRequestForm account={"0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28"} />
          </div>
        </div>
      )}
    </div>
  )
}

