// import { fetchInfrastructure } from "@/actions/streamData";
// import Footer from "@/components/Footer";
// import { Nav } from "@/components/Nav";
import { Poppins } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/components/QueryProvider";
import type { Metadata } from "next";
// import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CEEDD-STREAM",
  description:
    "CEEDD est une Organisation Non Gouvernementale de droit Congolais qui œuvre dans le secteur de la gestion durable des ressources environnementales pour le développement durable de la RDC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();
  // const pathnameFooter = usePathname();
  // const hideLayout = pathname === "/login";
  // const hideFooter = pathnameFooter === "/";
  // const infrastructures = await fetchInfrastructure();
  // console.log(infrastructures.results);

  return (
    <html lang="fr" className={poppins.className}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      </head>
      <body
        className="min-h-screen bg-gray-50 text-gray-900"
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <Header />
          {/* <Nav /> */}
          {/* {!hideLayout && } */}
          {children}
          {/* {!hideLayout && !pathnameFooter && <Footer />} */}
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
