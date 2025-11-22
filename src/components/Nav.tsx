"use client";
import { Locale, useTranslations } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { clsx } from "clsx";
import {
  CircleUser,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [token, setToken] = useState<string | null>(null);
  const { logout, user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuRef = useRef<HTMLDivElement>(null);
  const handletoggle = () => {
    setIsClicked((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOut = (e: MouseEvent | globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, []);

  return (
    <header
      className={`w-full h-(--header-hm)  lg:h-(--header-h) fixed top-0 left-0 right-0  zindex transition-all duration-500 ${isScrolled
        ? "border-b border-b-gray-100 bg-white shadow-lg"
        : "bg-white py-3 sm:py-4 border-b border-b-gray-100"
        }`}
    >
      <nav className="section max-w-9xl h-full flex items-center justify-between">
        <div className="flex items-center gap-14">
          <Link
            href="/"
            className="font-semibold text-lg no-underline flex items-center gap-2"
          >
            <Image
              src="/streamlogo.png"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 md:w-12 md:h-12 object-cover "
            />{" "}
            <span className="font-bold text-base text-(--text-color-title) uppercase">
              Sustainable Tools for Rainwater Evaluation And Management
            </span>
          </Link>
        </div>
        <div className="hidden  lg:flex items-center md:gap-4   lg:gap-6">
          <Link
            href="#"
            className={clsx(
              "hover:underline md:text-sm  lg:text-base  text-gray-600 hover:text-(--text-color-title)"
            )}
          >
            Accueil
          </Link>
          <Link
            href="#"
            className={clsx(
              "hover:underline md:text-sm lg:text-base  text-gray-600 hover:text-(--text-color-title)"
            )}
          >
            A propos{" "}
          </Link>
          <Link
            href="#"
            className={clsx(
              "hover:underline md:text-sm lg:text-base text-gray-600 hover:text-(--text-color-title)"
            )}
          >
            Zones bénéficiaires
          </Link>

          <Link
            href="#"
            className={clsx(
              "hover:underline md:text-sm lg:text-base text-gray-600 hover:text-(--text-color-title)"
            )}
          >
            Donate
          </Link>
          <div className="relative" ref={menuRef}>
            <CircleUser
              className="text-(--text-color-title) cursor-pointer"
              onClick={handletoggle}
            />
            {isClicked && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {_hasHydrated && isAuthenticated && user ? (
                  <ul className="py-1">
                    <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </li>

                    <li className="text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Link
                        href="/dashboard"
                        target="_blank"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {" "}
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </li>
                    <hr className="my-1" />
                    <li className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </li>
                  </ul>
                ) : (
                  <ul>
                    <li className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-red-50 cursor-pointer">
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
          {/* <div> */}
          <select className="p-1">
            <option value="fr">Fr</option>
            <option value="en">En</option>
          </select>
          {/* </div> */}
        </div>

        {/* <div className="hidden lg:flex items-center gap-4">
          {_hasHydrated && isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Button
                className="px-3 py-2 cursor-pointer   md:text-sm rounded-lg bg-green-700 text-gray-100 flex items-center gap-3"
                onClick={logout}
              >
                <User className="w-4 h-4" />
                Se Deconnecter
              </Button>
              <Link href="/dashboard" className="cursor-pointer">
                <Button className="px-3 py-2 cursor-pointer   md:text-sm rounded-lg bg-green-700 text-gray-100 flex items-center gap-3">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button className="px-3 py-2  rounded-lg bg-green-700 text-gray-100 flex items-center gap-3">
                <User className="w-4 h-4" />{" "}
                <span className="font-bold">Connexion</span>
              </Button>
            </Link>
          )}

          <button
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="bg-gray-200 px-3 py-2 rounded"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
        </div> */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
          {/* <X className="w-5 h-5 sm:w-6 sm:h-6" /> */}
        </button>

        {/* mobile navigation */}
        <div
          className={`lg:hidden  fixed z-50 inset-0 top-14 h-full sm:top-16 bg-white transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
            } `}
        >
          <div className="h-fit bg-white overflow-auto py-4 px-3 sm:py-6 sm:px-4">
            <div className="flex flex-col gap-2 sm:gap-4">
              <Link
                href="/donate"
                className={clsx("hover:underline flex items-center gap-2")}
              >
                <Heart className="w-3 h-3" />
                Donate
              </Link>
              <Link href="/waters" className={clsx("hover:underline")}>
                Pourquoi l'eau
              </Link>
              <Link href="/services" className={clsx("hover:underline")}>
                Nos services{" "}
              </Link>
              <Link href="/abouts" className={clsx("hover:underline")}>
                A propos de nous{" "}
              </Link>
              <Link href="/contacts" className={clsx("hover:underline")}>
                Contact{" "}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
