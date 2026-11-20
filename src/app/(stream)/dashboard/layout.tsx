import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

const LayoutDashboard = ({ children }: { children: ReactNode }) => {
  return (
    // AuthGuard entoure aussi la Sidebar : avant, elle s'affichait même pour
    // un visiteur non connecté, le temps que la page le redirige.
    <AuthGuard>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        {/* On ajoute un overflow-y-auto pour que seule la zone de contenu défile */}
        <main className="flex-1 h-[calc(100vh-80px)] overflow-y-auto">
          <div className=" mx-auto px-4 sm:px-6 lg:px-6 py-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default LayoutDashboard;
