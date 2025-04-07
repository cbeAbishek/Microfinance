// components/Header.js
import Link from 'next/link';
import { useState } from 'react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          Microfinance
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link href="/loans" className="hover:text-gray-300">
              Loans
            </Link>
          </li>
          <li>
            <Link href="/funding" className="hover:text-gray-300">
              Funding
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2">
          <li>
            <Link href="/loans" className="block hover:text-gray-300">
              Loans
            </Link>
          </li>
          <li>
            <Link href="/funding" className="block hover:text-gray-300">
              Funding
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="block hover:text-gray-300">
              Dashboard
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Header;
