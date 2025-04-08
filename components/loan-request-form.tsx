"use client";

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoanRequestForm() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [purpose, setPurpose] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);

    // Mouse move event listener
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate mouse position relative to the section
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Calculate percentages for mouse position (0 to 100)
  const mouseXpercentage =
    (mousePosition.x / (sectionRef.current?.offsetWidth || 1)) * 100;
  const mouseYpercentage =
    (mousePosition.y / (sectionRef.current?.offsetHeight || 1)) * 100;

  async function getMicrofinanceContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = "0x5eFd57C010b974F05CBEB2c69703c97A4Fb45F28";
    const abi = [
      "function requestLoan(uint256 amount, uint256 duration, string calldata purpose) external",
    ];
    return new ethers.Contract(contractAddress, abi, signer);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!amount || !purpose || !duration) {
      setMessage({ type: "error", text: "Please fill out all fields." });
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid loan amount greater than 0.",
      });
      return;
    }

    if (
      isNaN(Number(duration)) ||
      Number(duration) <= 0 ||
      Number(duration) > 365
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid duration between 1 and 365 days.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const amountInWei = ethers.parseEther(amount);
      const durationInDays = parseInt(duration);

      const contract = await getMicrofinanceContract();
      const tx = await contract.requestLoan(
        amountInWei,
        durationInDays,
        purpose
      );

      setMessage({ type: "success", text: "Submitting your loan request..." });

      await tx.wait();

      setMessage({
        type: "success",
        text: "Loan request confirmed on the blockchain.",
      });

      setAmount("");
      setPurpose("");
      setDuration("30");
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setMessage({
        type: "error",
        text: "Failed to submit loan request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-white text-gray-800">
        {/* Hero Section */}
        <section
          ref={sectionRef}
          className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center p-10"
        >
          {/* Mouse-following gradient overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle 400px at ${mouseXpercentage}% ${mouseYpercentage}%, rgba(255,255,255,0.15), transparent)`,
              transition: "background 0.2s",
            }}
          />

          {/* Animated background particles that react to mouse */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {Array(20)
              .fill(null)
              .map((_, i) => {
                const size = Math.random() * 16 + 8;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const floatDuration = Math.random() * 20 + 20; // 20–40s
                const floatDelay = Math.random() * 5;

                return (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-10 blur-sm"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}%`,
                      top: `${top}%`,
                      animation: `floatX ${floatDuration}s ease-in-out ${floatDelay}s infinite alternate,
                        floatY ${
                          floatDuration + 5
                        }s ease-in-out ${floatDelay}s infinite alternate`,
                    }}
                  />
                );
              })}
          </div>

          {/* Animated geometric shapes that react to mouse */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute w-64 h-64 rounded-full bg-blue-400 opacity-10 -top-20 -left-20 animate-blob"
              style={{
                transform: `translate(${(mouseXpercentage - 50) / -15}px, ${
                  (mouseYpercentage - 50) / -15
                }px)`,
                transition: "transform 0.3s ease-out",
              }}
            ></div>
            <div
              className="absolute w-72 h-72 rounded-full bg-purple-400 opacity-10 top-1/3 right-10 animate-blob animation-delay-2000"
              style={{
                transform: `translate(${(mouseXpercentage - 50) / 20}px, ${
                  (mouseYpercentage - 50) / 20
                }px)`,
                transition: "transform 0.4s ease-out",
              }}
            ></div>
            <div
              className="absolute w-80 h-80 rounded-full bg-pink-400 opacity-10 bottom-10 left-1/3 animate-blob animation-delay-4000"
              style={{
                transform: `translate(${(mouseXpercentage - 50) / -25}px, ${
                  (mouseYpercentage - 50) / -25
                }px)`,
                transition: "transform 0.5s ease-out",
              }}
            ></div>
          </div>

          {/* 3D rotating cube */}
          <div
            className="absolute right-10 bottom-10 perspective-cube"
            style={{
              transform: `translate(${(mouseXpercentage - 50) / 10}px, ${
                (mouseYpercentage - 50) / 10
              }px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <div className={`cube ${isVisible ? "animate-rotate" : ""}`}>
              <div className="cube-face cube-face-front bg-blue-500 opacity-30"></div>
              <div className="cube-face cube-face-back bg-blue-400 opacity-30"></div>
              <div className="cube-face cube-face-right bg-purple-500 opacity-30"></div>
              <div className="cube-face cube-face-left bg-purple-400 opacity-30"></div>
              <div className="cube-face cube-face-top bg-indigo-500 opacity-30"></div>
              <div className="cube-face cube-face-bottom bg-indigo-400 opacity-30"></div>
            </div>
          </div>

          {/* Main content with mouse parallax effect */}
          <div
            className="relative z-10 max-w-4xl mx-auto"
            style={{
              transform: `translate(${(mouseXpercentage - 50) / -30}px, ${
                (mouseYpercentage - 50) / -30
              }px)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 transition duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="inline-block animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
                Empowering Communities
              </span>
              <br />
              <span className="inline-block mt-2 animate-shimmer-delayed bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                through Decentralized Microfinance
              </span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 transition duration-1000 delay-300 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              A blockchain-powered platform making financial services
              <br />
              accessible, secure, and transparent for everyone.
            </p>

            <div
              className={`transition duration-1000 delay-500 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <button className="relative group bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Get Started
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left"></span>

                {/* Button particle effect on hover */}
                <span className="absolute -inset-4 group-hover:scale-100 scale-0 transition-transform duration-300">
                  {Array(8)
                    .fill(null)
                    .map((_, i) => (
                      <span
                        key={i}
                        className="absolute inline-flex w-2 h-2 bg-white rounded-full opacity-80"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `buttonParticle ${
                            Math.random() * 1 + 0.5
                          }s ease-out infinite alternate`,
                        }}
                      ></span>
                    ))}
                </span>
              </button>
            </div>

            {/* Floating blockchain icons that react to mouse */}
            <div
              className="absolute -right-16 top-12 animate-float opacity-20"
              style={{
                transform: `translate(${(mouseXpercentage - 50) / 5}px, ${
                  (mouseYpercentage - 50) / 5
                }px) rotate(${(mouseXpercentage - 50) / 20}deg)`,
                transition: "transform 0.6s ease-out",
              }}
            >
              <svg className="w-24 h-24" viewBox="0 0 24 24" fill="white">
                <path d="M12,0L4,6v12l8,6l8-6V6L12,0z M12,16.5L6,12.5v-5l6-3.5l6,3.5v5L12,16.5z" />
              </svg>
            </div>
            <div
              className="absolute -left-16 bottom-12 animate-float-delayed opacity-20"
              style={{
                transform: `translate(${(mouseXpercentage - 50) / 8}px, ${
                  (mouseYpercentage - 50) / 8
                }px) rotate(${(mouseXpercentage - 50) / -25}deg)`,
                transition: "transform 0.4s ease-out",
              }}
            >
              <svg className="w-20 h-20" viewBox="0 0 24 24" fill="white">
                <path d="M12,0L4,6v12l8,6l8-6V6L12,0z M12,16.5L6,12.5v-5l6-3.5l6,3.5v5L12,16.5z" />
              </svg>
            </div>
          </div>

          {/* Interactive connection points */}
          <div className="absolute inset-0 pointer-events-none">
            {Array(6)
              .fill(null)
              .map((_, i) => {
                const pointX = 10 + i * 20;
                const pointY = Math.random() * 100;
                const distX = (mouseXpercentage - pointX) / 15;
                const distY = (mouseYpercentage - pointY) / 15;

                return (
                  <div key={i} className="absolute">
                    <div
                      className="w-2 h-2 bg-white rounded-full opacity-70"
                      style={{
                        left: `${pointX}%`,
                        top: `${pointY}%`,
                        transform: `translate(${distX}px, ${distY}px)`,
                        transition: "transform 0.3s ease-out",
                      }}
                    />
                    <div
                      className="absolute w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      style={{
                        left: `${pointX}%`,
                        top: `${pointY}%`,
                        width: `${Math.hypot(distX, distY) * 5}px`,
                        transform: `rotate(${
                          Math.atan2(distY, distX) * (180 / Math.PI)
                        }deg)`,
                        transformOrigin: "0 0",
                        transition:
                          "width 0.3s ease-out, transform 0.3s ease-out",
                      }}
                    />
                  </div>
                );
              })}
          </div>

          <section>
            <div className="max-w-xl mx-auto mt-16 mb-16  sm:px-8 lg:px-4">
              <div className="relative z-10 bg-white rounded-xl shadow-2xl p-2 sm:p-8 animate-fade-in-up transition-all duration-500 ease-in-out">
                <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6 tracking-tight">
                  Request a Loan
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="number"
                      placeholder="Amount (ETH)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <input
                      type="number"
                      placeholder="Duration (days)"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <textarea
                      placeholder="Loan purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      disabled={isSubmitting}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-xl text-white font-bold text-lg transition duration-300 transform ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Request Loan"}
                  </button>
                </form>

                {message && (
                  <p
                    className={`mt-6 text-center text-sm font-semibold ${
                      message.type === "error"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          </section>
        </section>
        
        {/* Value Proposition */}
        <section className="py-20 px-10 text-center bg-gray-50 animate-slide-up">
          <h2 className="text-4xl font-bold mb-6">Why Choose Our Platform?</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            We bring the power of blockchain to microfinance—ensuring fairness,
            transparency, and access for underserved communities globally.
          </p>
        </section>

        {/* How It Works */}
        <section className="py-20 px-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Request Loan", "Community Voting", "Receive Funds"].map(
              (step, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-2xl p-6 text-center transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-5xl font-bold text-blue-500 mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step}</h3>
                  <p className="text-gray-600">
                    {step} with complete transparency and zero intermediaries.
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Blockchain Benefits */}
        <section className="py-20 px-10 bg-gradient-to-br from-green-100 to-blue-100 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-10">
            Blockchain Benefits
          </h2>
          <ul className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700">
            <li>✅ Immutable transaction records</li>
            <li>✅ Peer-to-peer lending with no middlemen</li>
            <li>✅ Transparent and fair governance</li>
            <li>✅ Decentralized credit scoring</li>
          </ul>
        </section>

        {/* Features */}
        <section className="py-20 px-10 text-center animate-slide-up">
          <h2 className="text-3xl font-bold mb-10">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Smart Contract Loans",
              "Credit Scoring",
              "Admin Controls",
              "Community Governance",
              "Wallet Integration",
              "Real-time Analytics",
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p className="text-gray-600">
                  Explore how {feature.toLowerCase()} enhances transparency and
                  trust.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Security and Trust */}
        <section className="py-20 px-10 bg-gray-100 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center mb-10">
            Security and Trust
          </h2>
          <p className="max-w-3xl mx-auto text-center text-gray-700">
            Built with industry-standard smart contracts and audited systems to
            ensure your funds and data are always safe.
          </p>
        </section>

        {/* Pricing */}
        <section className="py-20 px-10 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Simple Pricing</h2>
          <p className="text-gray-600 mb-10">
            Only pay when your loan is funded. Transparent fees. No hidden
            costs.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="border rounded-xl p-8 w-full md:w-1/3 bg-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Borrower</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                1% Platform Fee
              </p>
              <p className="text-gray-600">Only when your loan is approved.</p>
            </div>
            <div className="border rounded-xl p-8 w-full md:w-1/3 bg-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Lender</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">0% Fee</p>
              <p className="text-gray-600">
                Support communities, earn interest.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-10 animate-slide-up">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold">
                How do I request a loan?
              </h4>
              <p className="text-gray-600">
                Connect your wallet and submit a loan request with the required
                information. The community will vote on it.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">Is my data secure?</h4>
              <p className="text-gray-600">
                Yes, all sensitive data is stored securely and transactions are
                recorded immutably on-chain.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">
                What if my loan is not approved?
              </h4>
              <p className="text-gray-600">
                You can revise and resubmit or explore other community loan
                options.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-gray-800 text-white text-center">
          <p>&copy; 2025 MicroFinance DApp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
