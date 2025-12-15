"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { useLogOut } from "./hooks/useAuth";
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const mutationLogout = useLogOut();
  const router = useRouter();
  const handleLogout = () => {
    mutationLogout.mutate();
    //  setIsClicked(false); // Fermer le menu après la déconnexion
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/home" },
    { name: "About Us", href: "/abouts" },
    { name: "Donate", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-1100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/streamlogo.png"
              alt="logo"
              width={56}
              height={56}
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
            />
            <span
              className={clsx(
                "font-bold text-xl tracking-tight text-gray-900 max-w-xs", // Correction de la couleur et taille pour la lisibilité
                "hidden sm:inline" // Masquer sur les très petits écrans si nécessaire
              )}
              title='Sustainable Tools for Rainwater Evaluation And Management'
            >
              {/* Sustainable Tools for Rainwater Evaluation And Management */}
              STREAM
            </span>
          </Link>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm transition-colors pb-1 ${isActive ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'font-medium text-gray-900 hover:text-blue-600'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-50 focus:border-blue-500 text-sm cursor-pointer font-medium hover:text-gray-900"
                aria-label="Language selection"
              >
                <option value="EN">EN</option>
                <option value="FR">FR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {_hasHydrated && isAuthenticated && user ? (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Deconnexion
              </button>
            ) : (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
                onClick={handleLogin}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-lg z-50">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 ${isActive ? 'font-bold text-blue-600' : 'font-medium text-gray-700 hover:text-blue-600'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-700 font-medium">Language</span>
              <div className="flex space-x-2">
                <button className="text-blue-600 font-bold">EN</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-500 hover:text-blue-600">
                  FR
                </button>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-center"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
