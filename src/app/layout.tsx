// "use client";
// import { fetchInfrastructure } from "@/actions/streamData";
import Footer from "@/components/Footer";
import { Nav } from "@/components/Nav";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CEEDD- Kinshasa",
  description:
    "CEEDD est une Organisation Non Gouvernementale de droit Congolais qui œuvre dans le secteur de la gestion durable des ressources environnementales pour le développement durable de la RDC",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const infrastructures = await fetchInfrastructure();
  // console.log(infrastructures.results);

  return (
    <html lang="fr" className={poppins.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <QueryProvider>
          <Nav />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
