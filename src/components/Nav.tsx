"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { Button } from "@radix-ui/themes";
import { Heart, Menu, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Locale, useTranslations } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { isAUthentificated } from "@/utils/utils";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [token, setToken] = useState<string | null>(null);
  const { logout } = useAppStore();
  const router = useRouter();
  // const token = localStorage.getItem("ceeAuth-token");
  // const useAuthentificated = isAUthentificated();
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

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("ceeAuth-token");
  //   setToken(storedToken);
  // }, []);
  // const isLogined = !!token;

  return (
    <header
      //  Change 'sticky' to 'fixed' to take it out of the regular document flow
      className={`w-full h-(--header-hm)  lg:h-(--header-h) fixed top-0 left-0 right-0  zindex transition-all duration-500 ${
        isScrolled
          ? "border-b border-b-gray-100 bg-white shadow-lg"
          : "bg-white py-3 sm:py-4 border-b border-b-gray-100"
      }`}
    >
      <nav className="section max-w-9xl h-full flex items-center justify-between">
        <div className="flex items-center gap-14">
          <Link
            href="/"
            className="font-semibold text-lg no-underline flex items-center gap-3"
          >
            <Image
              src="/logo.jpg"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
            />{" "}
            <span className="font-bold text-xl text-green-700">CEEDD</span>
          </Link>
          <div className="hidden  lg:flex items-center md:gap-4   lg:gap-6">
            <Link
              href="#"
              className={clsx("hover:underline flex items-center gap-2 ")}
            >
              <Heart className="w-3 h-3" />
              Donate
            </Link>
            <Link
              href="#"
              className={clsx("hover:underline md:text-sm  lg:text-base")}
            >
              Pourquoi l'eau
            </Link>
            <Link
              href="#"
              className={clsx("hover:underline md:text-sm lg:text-base")}
            >
              Nos services{" "}
            </Link>
            <Link
              href="#"
              className={clsx("hover:underline md:text-sm lg:text-base")}
            >
              A propos de nous{" "}
            </Link>
            <Link
              href="#"
              className={clsx("hover:underline md:text-sm lg:text-base")}
            >
              Contact{" "}
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          {/* {useAuthentificated ? (
            <Button
              className="px-3 py-2  md:text-sm rounded-lg bg-green-700 text-gray-100 flex items-center gap-3"
              onClick={logout}
            >
              <User className="w-4 h-4" />
              Se Deconnecter
            </Button>
          ) : (
            <Link href="/login">
              <Button className="px-3 py-2  rounded-lg bg-green-700 text-gray-100 flex items-center gap-3">
                <User className="w-4 h-4" />{" "}
                <span className="font-bold">Connexion</span>
              </Button>
            </Link>
          )} */}
          <Link href="/login">
            <Button className="px-3 py-2  rounded-lg bg-green-700 text-gray-100 flex items-center gap-3">
              <User className="w-4 h-4" />{" "}
              <span className="font-bold">Connexion</span>
            </Button>
          </Link>
          <button
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="bg-gray-200 px-3 py-2 rounded"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
        </div>
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
          className={`lg:hidden  fixed z-50 inset-0 top-14 h-full sm:top-16 bg-white transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
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
