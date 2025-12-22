import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const socialLinks = [
  {
    href: "https://web.facebook.com/p/CEEDD-100075980903950",
    label: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Intagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2Zm4.6 2.42a7.59 7.59 0 0 0-.46-2.43a4.94 4.94 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.78 4.78 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43C2 8.94 2 9.28 2 12s0 3.06.06 4.12a7.3 7.3 0 0 0 .47 2.43a4.7 4.7 0 0 0 1.15 1.77a4.78 4.78 0 0 0 1.77 1.15a7.3 7.3 0 0 0 2.43.47C8.94 22 9.28 22 12 22s3.06 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47a4.7 4.7 0 0 0 1.77-1.15a4.85 4.85 0 0 0 1.16-1.77a7.59 7.59 0 0 0 .46-2.43c0-1.06.06-1.4.06-4.12s0-3.06-.06-4.12ZM20.14 16a5.61 5.61 0 0 1-.34 1.86a3.06 3.06 0 0 1-.75 1.15a3.19 3.19 0 0 1-1.15.75a5.61 5.61 0 0 1-1.86.34c-1 .05-1.37.06-4 .06s-3 0-4-.06a5.73 5.73 0 0 1-1.94-.3a3.27 3.27 0 0 1-1.1-.75a3 3 0 0 1-.74-1.15a5.54 5.54 0 0 1-.4-1.9c0-1-.06-1.37-.06-4s0-3 .06-4a5.54 5.54 0 0 1 .35-1.9A3 3 0 0 1 5 5a3.14 3.14 0 0 1 1.1-.8A5.73 5.73 0 0 1 8 3.86c1 0 1.37-.06 4-.06s3 0 4 .06a5.61 5.61 0 0 1 1.86.34a3.06 3.06 0 0 1 1.19.8a3.06 3.06 0 0 1 .75 1.1a5.61 5.61 0 0 1 .34 1.9c.05 1 .06 1.37.06 4s-.01 3-.06 4ZM12 6.87A5.13 5.13 0 1 0 17.14 12A5.12 5.12 0 0 0 12 6.87Zm0 8.46A3.33 3.33 0 1 1 15.33 12A3.33 3.33 0 0 1 12 15.33Z"
        />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const Footer = async () => {
  const t = await getTranslations();

  return (
    <footer className="bg-gray-950 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 px-8 py-4">
        <div className="flex flex-col items-center text-gray-100 gap-4 lg:items-start">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={40}
            height={40}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
          />
          <p className="max-w-sm text-sm leading-relaxed">
            {t("Footer.ceedd")}
          </p>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start ">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            {t("Footer.contact")}
          </h2>
          <span className="text-sm">
            Email:{" "}
            <a href="mailto:test@gmail.com" className="hover:text-blue-500">
              test@gmail.com
            </a>
          </span>
          <span className="text-sm">+243 (0)89 8243 566</span>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Navigation
          </h2>
          <ul className="flex flex-col items-center text-gray-100  gap-4 lg:items-start text-sm">
            <li>Donate</li>
            <li>Pourquoi l'eau</li>
            <li>Nos services</li>
            <li>A propos de nous</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="flex flex-col items-center text-gray-100 gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3 lg:text-xl lg:py-4">
            {t("Footer.followUs")}
          </h2>

          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                target="_blank"
                rel="noopener noreferrer"
                href={link.href}
                className="p-2 bg-white/10 rounded-full hover:bg-highlight hover:text-blue-600 transition-colors"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
        <p>&copy;{t("Footer.copyright", { date: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
};

export default Footer;
