import { Poppins } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/Header";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";

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
  title: "CEEDD-STREAM",
  description:
    "CEEDD est une Organisation Non Gouvernementale de droit Congolais qui œuvre dans le secteur de la gestion durable des ressources environnementales pour le développement durable de la RDC",
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
    </html>
  );
}
