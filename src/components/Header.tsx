"use client";

import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { useAppStore } from "@/store/appStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLogOut } from "./hooks/useAuth";
import LocaleSwitcher from "./Locale-switcher";

export const Header: React.FC = () => {
  const t = useTranslations("Header");

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
    { name: `${t("about")}`, href: "/abouts" },
    { name: `${t("donate")}`, href: "#" },
    { name: `${t("contact")}`, href: "#" },
  ];

  return (
    <header className="bg-gray-50 border-b border-gray-100 sticky top-0 z-1100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* --- Gauche: Logo --- */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/streamlogo.png"
              alt="logo"
              width={56}
              height={56}
              className="w-8 h-8 md:w-9 lg:w-10 lg:h-10 object-cover"
            />
            <span
              className={clsx(
                "font-bold tracking-tight text-gray-900",
                "hidden sm:inline-block text-base md:text-sm lg:text-xl",
              )}
              title="Sustainable Tools for Rainwater Evaluation And Management"
            >
              STREAM
            </span>
          </Link>

          {/* --- Centre: Navigation (Desktop & Tablet) --- */}
          <nav className="hidden md:flex items-center md:space-x-3 lg:space-x-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors pb-1 border-b-2 ${
                    isActive
                      ? "font-bold text-blue-600 border-blue-600"
                      : "font-medium text-gray-900 border-transparent hover:text-blue-600"
                  } md:text-xs lg:text-sm`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* --- Droite: Actions (Desktop & Tablet) --- */}
          <div className="hidden md:flex items-center md:gap-1 lg:gap-4">
            <div className="relative md:scale-90 lg:scale-100">
              <LocaleSwitcher />
            </div>

            <div className="flex items-center gap-2 ml-1 lg:ml-4">
              {_hasHydrated && isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
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
                    {t("logout")}
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
                    target="_blank"
                  >
                    {t("backOffice")}
                  </Link>
                </div>
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
                  {t("login")}
                </button>
              )}
            </div>
          </div>

          {/* --- Bouton Menu Mobile --- */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 p-2 focus:outline-none"
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

      {/* --- Menu Mobile (Dropdown) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-2xl z-[1200]">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-3 px-2 rounded-lg text-base ${
                    isActive
                      ? "font-bold text-blue-600 bg-blue-50"
                      : "font-medium text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="h-px bg-gray-100 my-4"></div>

            {/* Actions Mobile */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-700 font-medium">
                  {t("language")}
                </span>
                <LocaleSwitcher />
              </div>

              {_hasHydrated && isAuthenticated && user ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="bg-orange-600 text-white py-3 rounded-xl font-bold text-center"
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </button>
                  <Link
                    href="/dashboard"
                    className="bg-green-600 text-white py-3 rounded-xl font-bold text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("backOffice")}
                  </Link>
                </div>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center shadow-lg shadow-blue-200"
                  onClick={handleLogin}
                >
                  {t("login")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
