"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { Button } from "@radix-ui/themes"; // Assurez-vous que Radix Themes est configuré
import {
  CircleUser,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Locale, useTranslations } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { useLogOut } from "./hooks/useAuth";
import { Input } from "./ui/input";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [token, setToken] = useState<string | null>(null);
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const mutationLogout = useLogOut();

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Désactivation/Activation du défilement du corps
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Nettoyage au démontage pour s'assurer que le défilement est réactivé
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Gestion du menu déroulant utilisateur
  const menuRef = useRef<HTMLDivElement>(null);
  const handletoggle = () => {
    setIsClicked((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOut = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, []);

  const handleLogout = () => {
    mutationLogout.mutate();
    setIsClicked(false); // Fermer le menu après la déconnexion
  };

  const handleMobileLinkClick = () => {
    setIsOpen(false); // Fermer le menu mobile après un clic sur un lien
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  return (
    <header
      // Correction des hauteurs non standard et de zindex
      className={clsx(
        "w-full fixed top-0 left-0 right-0 z-1001 transition-all duration-500",
        "h-14 lg:h-20", // Hauteur par défaut et pour grand écran
        isScrolled
          ? "border-b border-gray-100 bg-white shadow-lg"
          : "bg-white py-3 sm:py-4 border-b border-gray-100"
      )}
    >
      <nav className="section max-w-9xl h-full flex items-center justify-around px-4 sm:px-6 lg:px-24">
        {/* Logo et titre */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-semibold text-lg no-underline flex items-center gap-2"
          >
            <Image
              src="/streamlogo.png"
              alt="logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 object-cover"
            />
            <span
              className={clsx(
                "font-bold text-xl tracking-tight text-gray-800 max-w-xs", // Correction de la couleur et taille pour la lisibilité
                "hidden sm:inline" // Masquer sur les très petits écrans si nécessaire
              )}
            >
              {/* Sustainable Tools for Rainwater Evaluation And Management */}
              STREAM
            </span>
          </Link>
        </div>

        {/* Barre de recherche (cachée sur petit écran, peut-être ?) */}
        <div className="relative hidden lg:block w-96">
          <Input
            type="text"
            name="searchfield"
            placeholder="Rechercher..."
            className="border border-gray-300 w-full pr-10" // Ajout de padding à droite
          />
          <Search className="w-5 h-5 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
        </div>

        {/* Navigation Bureau */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="#"
            className="hover:underline text-base text-gray-600 hover:text-blue-600 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="#"
            className="hover:underline text-base text-gray-600 hover:text-blue-600 transition-colors"
          >
            A propos
          </Link>
          <Link
            href="#"
            className="hover:underline text-base text-gray-600 hover:text-blue-600 transition-colors"
          >
            Zones bénéficiaires
          </Link>
          <Link
            href="#"
            className="hover:underline text-base text-gray-600 hover:text-blue-600 transition-colors"
          >
            Donate
          </Link>

          {/* Menu Utilisateur */}
          <div className="relative" ref={menuRef}>
            <CircleUser
              className="text-blue-600 w-6 h-6 cursor-pointer hover:text-blue-800 transition-colors" // Correction de la couleur/taille
              onClick={handletoggle}
            />
            {isClicked && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-10">
                <ul className="py-1">
                  {_hasHydrated && isAuthenticated && user ? (
                    <>
                      <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </li>
                      <li>
                        <Link
                          href="/dashboard"
                          target="_blank"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsClicked(false)} // Fermer après le clic
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </li>
                      <hr className="my-1 border-gray-100" />
                      <li
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsClicked(false)} // Fermer après le clic
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Sélecteur de langue */}
          {/* <select
            className="p-1 border border-gray-300 rounded-md bg-white text-sm"
            value={locale}
            onChange={handleLocaleChange}
          >
            <option value="fr">Fr</option>
            <option value="en">En</option>
          </select> */}
          <div className="relative">
            <select
              value={locale}
              onChange={handleLocaleChange}
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
        </div>

        {/* Bouton du menu mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-blue-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Mobile (Menu Coulissant) */}
        <div
          className={`lg:hidden fixed z-40 inset-0 pt-14 sm:pt-16 bg-white transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto py-4 px-3 sm:py-6 sm:px-4 flex flex-col gap-4">
            {/* Recherche mobile (optionnel) */}
            <div className="relative mb-4">
              <Input
                type="text"
                name="searchfield-mobile"
                placeholder="Rechercher..."
                className="border border-gray-300 w-full pr-10"
              />
              <Search className="w-5 h-5 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
            </div>

            <Link
              href="#"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-gray-700 hover:text-blue-600 py-2 flex items-center gap-2"
            >
              Accueil
            </Link>
            <Link
              href="/abouts"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              A propos de nous
            </Link>
            <Link
              href="/services"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              Nos services
            </Link>
            <Link
              href="/waters"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              Pourquoi l'eau
            </Link>
            <Link
              href="/contacts"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              Contact
            </Link>
            <Link
              href="/donate"
              onClick={handleMobileLinkClick}
              className="hover:underline text-lg font-medium text-blue-600 hover:text-blue-800 py-2 flex items-center gap-2 border-t mt-2 pt-4"
            >
              <Heart className="w-5 h-5" />
              Faire un Don
            </Link>

            {/* Actions d'authentification mobile */}
            <div className="mt-auto border-t pt-4">
              {_hasHydrated && isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={handleMobileLinkClick}
                    className="flex items-center text-lg font-medium text-gray-700 hover:text-blue-600 py-2"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center text-lg font-medium text-red-600 hover:text-red-800 py-2"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={handleMobileLinkClick}
                  className="flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 py-2"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Connexion
                </Link>
              )}
            </div>

            {/* Sélecteur de langue mobile */}
            <select
              className="mt-4 p-2 border border-gray-300 rounded-md bg-gray-50 text-base"
              value={locale}
              onChange={handleLocaleChange}
            >
              <option value="fr">Français (Fr)</option>
              <option value="en">Anglais (En)</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
