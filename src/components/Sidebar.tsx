// import NavMenu from "./NavMenu";

// const Sidebar = () => {
//   return (
//     <div className="w-20 md:w-72 pt-2 py-2 min-h-screen bg-white shadow-lg">
//       <div>
//         <h1 className="hidden md:p-6 md:block font-semibold">Navigation</h1>
//         <NavMenu />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
"use client";
import { useAppStore } from "@/store/appStore";
import NavMenu from "./NavMenu";

const Sidebar = () => {
  const { user } = useAppStore();
  return (
    <aside className="sticky top-0 h-screen w-20 md:w-72 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col">
      {/* Section Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-4">
          <p className="hidden md:block text-[10px] font-uppercase font-bold text-gray-400 uppercase tracking-widest px-2">
            Menu Principal
          </p>
        </div>
        <NavMenu />
      </div>

      {/* Section Pied de Sidebar (Optionnel: Profil ou Aide) */}
      <div className="p-4 border-t border-gray-100 hidden md:block">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">
              {user?.username}
            </span>
            <span className="text-xs text-gray-500">Administrateur</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
