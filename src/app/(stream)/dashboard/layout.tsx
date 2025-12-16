import Sidebar from "@/components/Sidebar";

import React, { ReactNode } from "react";

const layoutDashboard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex ">
      <Sidebar />
      <main className="flex-1 px-6 pt-16">{children}</main>
    </div>
  );
};

export default layoutDashboard;
