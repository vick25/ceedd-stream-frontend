import Footer from "@/components/Footer";
import { Nav } from "@/components/Nav";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GeoApp - Gestion des puits",
  description: "Gestion des puits de parcelle pour éviter les érosions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={poppins.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
