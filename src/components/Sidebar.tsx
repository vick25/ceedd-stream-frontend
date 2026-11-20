"use client";

import { useAppStore } from "@/store/appStore";
import NavMenu from "./NavMenu";

const Sidebar = () => {
  const { user } = useAppStore();
  return (
    <aside className="sticky top-0 z-20 flex h-dvh w-20 shrink-0 flex-col border-r border-slate-200 bg-white/95 shadow-[4px_0_24px_-20px_rgba(15,23,42,0.35)] backdrop-blur md:w-72">
      <div className="hidden border-b border-slate-100 px-6 py-6 md:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold tracking-wide text-white shadow-sm shadow-blue-200">C</div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">CEEDD</p>
            <p className="text-xs text-slate-500">Espace de gestion STREAM</p>
          </div>
        </div>
      </div>
      {/* Section Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="mb-3 px-4">
          <p className="hidden px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 md:block">
            Menu Principal
          </p>
        </div>
        <NavMenu />
      </div>

      {/* Section Pied de Sidebar (Optionnel: Profil ou Aide) */}
      <div className="hidden border-t border-slate-100 p-4 md:block">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">
              {user?.username}
            </span>
            <span className="text-xs text-slate-500">Administrateur</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
