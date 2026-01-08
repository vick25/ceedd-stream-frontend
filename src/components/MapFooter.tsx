import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  const t = useTranslations("HomePage");

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid System: 1 colonne sur mobile, 3 sur desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
          {/* Section Gauche: Brand & Mission */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center shrink-0">
                <Image
                  src="/streamlogo.png"
                  alt="Streams Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg lg:text-xl tracking-tight leading-tight">
                Sustainable Tools for Rainwater
                <br /> Evaluation And Management
              </span>
            </div>

            <p className="text-gray-400 text-sm max-w-sm">
              {t("missionDescription")}
            </p>

            {/* Social Icons - Centrés sur mobile, à gauche sur desktop */}
            <div className="flex justify-center md:justify-start space-x-6">
              <SocialIcon
                href="https://web.facebook.com/p/CEEDD-100075980903950"
                label="Facebook"
                d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
              />
              <SocialIcon
                href="#"
                label="Twitter"
                d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              />
              <SocialIcon
                href="#"
                label="LinkedIn"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </div>
          </div>

          {/* Section Milieu: Partenaires */}
          <div className="flex flex-col items-center space-y-6">
            <h2 className="font-bold text-base lg:text-xl uppercase tracking-wider text-gray-300">
              {t("partner")}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Link
                href="https://www.ceeddrdc.org/"
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/ceedd.png"
                  alt="CEEDD logo"
                  width={120}
                  height={60}
                  className="h-16 w-auto object-contain filter brightness-110"
                />
              </Link>
              <Link
                href="https://www.tfrain.org/"
                target="_blank"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/terrafirma.png"
                  alt="TerraFirma Logo"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Section Droite: Copyright / Liens Rapides */}
          <div className="flex flex-col items-center md:items-end justify-center h-full md:pt-8">
            <p className="text-gray-500 text-sm">
              &copy; {t("copyright", { date: new Date().getFullYear() })}
            </p>
            <p className="text-gray-600 text-xs mt-2">All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Petit composant utilitaire pour les icônes
const SocialIcon = ({
  href,
  label,
  d,
}: {
  href: string;
  label: string;
  d: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="no-referrer no-opener"
    className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700"
    aria-label={label}
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  </Link>
);
