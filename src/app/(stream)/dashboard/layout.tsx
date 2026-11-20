import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

const LayoutDashboard = ({ children }: { children: ReactNode }) => {
  return (
    // AuthGuard entoure aussi la Sidebar : avant, elle s'affichait même pour
    // un visiteur non connecté, le temps que la page le redirige.
    <AuthGuard>
      <div className="h-dvh min-h-0 flex overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto h-full min-h-0 px-4 sm:px-6 lg:px-6 py-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default LayoutDashboard;
