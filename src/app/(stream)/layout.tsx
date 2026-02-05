import { Poppins } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/Header";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "CEEDD-STREAM | Suivi des Infrastructures Hydrauliques en RDC",
  description:
    "ONG CEEDD : Experts en gestion durable des ressources en RDC. Plateforme STREAM pour le suivi SIG des eaux pluviales et la lutte contre l'érosion à Kinshasa.",
  keywords: [
    "CEEDD rdc",
    "Plateforme de suivi des infrastructures hydrauliques",
    "Reporting impact projets eau et assainissement",
    "Digitalisation des données SIG pour ONG",
    "Gestion résiliente des eaux pluviales en milieu urbain",
    "Cartographie interactive infrastructures de drainage",
    "Erosion universite de Kinshasa",
    "Water management DRC",
    "Sustainable tools for rainwater evaluation",
  ],
  openGraph: {
    title: "CEEDD-STREAM | Innovation SIG pour l'eau en RDC",
    description:
      "Digitaliser la gestion des eaux pluviales pour un développement durable.",
    url: "https://stream.ceeddrdc.org",
    siteName: "CEEDD STREAM",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({ children }: Readonly<Props>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={poppins.className}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      </head>
      <body
        className="min-h-screen bg-gray-50 text-gray-900"
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background:
                    "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-LPX4MKCGEV" />
    </html>
  );
}
