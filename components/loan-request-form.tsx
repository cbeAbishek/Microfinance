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
          className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center px-4 py-16 md:p-10"
        >
          {/* Mouse-following gradient overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle 400px at ${mouseXpercentage}% ${mouseYpercentage}%, rgba(255,255,255,0.15), transparent)`,
              transition: "background 0.2s",
            }}
          />

          {/* Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {Array(20)
              .fill(null)
              .map((_, i) => {
                const size = Math.random() * 16 + 8;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const floatDuration = Math.random() * 20 + 20;
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
                      animation: `floatX ${floatDuration}s ease-in-out ${floatDelay}s infinite alternate, floatY ${
                        floatDuration + 5
                      }s ease-in-out ${floatDelay}s infinite alternate`,
                    }}
                  />
                );
              })}
          </div>

          {/* Main Content */}
          <div
            className="relative z-10 max-w-[1200px] mt-[100px] mx-auto px-4 sm:px-6 lg:px-8"
            style={{
              transform: `translate(${(mouseXpercentage - 50) / -30}px, ${
                (mouseYpercentage - 50) / -30
              }px)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="block animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
                Empowering Communities
              </span>
              <span className="block mt-2 animate-shimmer-delayed bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                through Decentralized Microfinance
              </span>
            </h1>

            <p
              className={`text-base sm:text-lg md:text-xl mb-8 transition duration-1000 delay-300 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              A blockchain-powered platform making financial services
              accessible, secure, and transparent for everyone.
            </p>

            <div
              className={`transition duration-1000 delay-500 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <button className="relative group bg-white text-blue-600 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Get Started
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left"></span>
              </button>
            </div>
          </div>

          {/* Loan Request Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 mt-16">
            <div className="relative z-10 bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xl mx-auto animate-fade-in-up transition-all duration-500 ease-in-out">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-600 mb-6">
                Request a Loan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <input
                  type="number"
                  placeholder="Amount (ETH)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Duration (days)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                />
                <textarea
                  placeholder="Loan purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
                />
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
                {message && (
                  <p
                    className={`text-center text-sm font-semibold ${
                      message.type === "error"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </form>

            </div>
          </section>
        </section>

        {/* Value Proposition */}
        <section className="py-20 px-10 bg-gray-50 animate-fade-in-up">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
              We leverage blockchain technology to revolutionize
              microfinance—offering fairness, transparency, and access to
              underserved communities globally.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-blue-500 text-white text-3xl font-bold mb-6">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Decentralized & Transparent
                </h3>
                <p className="text-gray-600">
                  All transactions are recorded on the blockchain, ensuring
                  complete transparency and immutability.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-green-500 text-white text-3xl font-bold mb-6">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Lower Fees & Faster Processing
                </h3>
                <p className="text-gray-600">
                  Eliminate intermediaries and enjoy lower fees with instant
                  loan approvals and fund transfers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-indigo-500 text-white text-3xl font-bold mb-6">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Empowering Communities
                </h3>
                <p className="text-gray-600">
                  Provide access to financial services for underserved
                  communities, fostering economic growth and inclusion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-10 bg-gray-50 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-blue-500 text-white text-3xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Request a Loan
              </h3>
              <p className="text-gray-600">
                Submit your loan request in minutes. Our decentralized platform
                ensures transparency and fairness.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-green-500 text-white text-3xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Community Voting
              </h3>
              <p className="text-gray-600">
                Your loan request is reviewed by the community. Decentralized
                governance ensures fair decision-making.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex justify-center items-center w-16 h-16 mx-auto rounded-full bg-indigo-500 text-white text-3xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Receive Funds
              </h3>
              <p className="text-gray-600">
                Once approved, funds are transferred instantly via blockchain.
                No intermediaries, no delays.
              </p>
            </div>
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
        <section className="py-20 px-6 sm:px-10 lg:px-24 bg-gray-100 animate-fade-in-up">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              Security and Trust
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Your security is our top priority. We use blockchain’s inherent
              transparency and industry best practices to protect your assets,
              identity, and data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Security Item */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Smart Contract Safety</h3>
              <p className="text-gray-600">
                All financial operations are handled through immutable smart
                contracts with strict checks and balances.
              </p>
            </div>

            {/* Audit */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Third-Party Audits</h3>
              <p className="text-gray-600">
                Our contracts are regularly audited by reputable firms to ensure
                zero vulnerabilities and maximum reliability.
              </p>
            </div>

            {/* Transparency */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">On-Chain Transparency</h3>
              <p className="text-gray-600">
                All transactions are publicly verifiable on the blockchain,
                eliminating any chances of fraud or manipulation.
              </p>
            </div>

            {/* Data Protection */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Data Privacy</h3>
              <p className="text-gray-600">
                We use end-to-end encryption and decentralized identity methods
                to protect your personal information.
              </p>
            </div>

            {/* Multi-Sig Wallets */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Multi-Sig Wallets</h3>
              <p className="text-gray-600">
                Platform funds are managed through multi-signature wallets to
                prevent single-point failures.
              </p>
            </div>

            {/* 24/7 Monitoring */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="text-blue-600 text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">24/7 Monitoring</h3>
              <p className="text-gray-600">
                Our systems are monitored continuously for unusual activity to
                catch threats before they escalate.
              </p>
            </div>
          </div>
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
                0.5% Platform Fee
              </p>
              <p className="text-gray-600">Only when your loan is approved.</p>
            </div>
            <div className="border rounded-xl p-8 w-full md:w-1/3 bg-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Lender</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">1% Fee</p>
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
