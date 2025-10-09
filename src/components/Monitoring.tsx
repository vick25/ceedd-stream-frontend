"use client";
import Image from "next/image";

const users = [
  {
    id: "A7623",
    name: "Adam Cooper",
    info: "1H-7874",
    avatar: "/avatar1.png",
    online: true,
  },
  // ...ajoute les autres utilisateurs ici
];

export default function MonitoringPage() {
  return (
    <div className="flex min-h-screen bg-[#e7eaf6]">
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <span className="text-blue-600 text-xl">⚙️</span>
        </div>
        {/* Ajoute d'autres icônes ici */}
        <div className="flex-1" />
        <div className="w-8 h-8 bg-gray-100 rounded" />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-8 py-4 border-b">
          <nav className="flex space-x-8">
            <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2">
              Monitoring
            </button>
            <button className="text-gray-500">Planning</button>
            <button className="text-gray-500">Load Boards</button>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-sm">
              12
            </span>
            <span className="font-semibold">Faya Reagan ▾</span>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Map section */}
          <section className="relative flex-1 bg-white">
            {/* Remplace par un composant Map si besoin */}
            <Image
              src="/map-placeholder.png"
              alt="Carte"
              fill
              className="object-cover"
              style={{ zIndex: 0 }}
            />
            {/* Cartes d'infos en bas */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
              <div className="bg-white rounded-lg shadow p-4 min-w-[220px]">
                <div className="font-bold text-gray-700">N4162</div>
                <div className="text-xs text-gray-500">Pickup Location</div>
                <div className="text-sm">35th Ave NF, Seattle</div>
                <div className="text-xs text-gray-500 mt-2">
                  Dropoff Location
                </div>
                <div className="text-sm">1401 Elliot Ave, Seattle</div>
              </div>
              {/* ...autres cartes */}
            </div>
          </section>

          {/* Right panel */}
          <aside className="w-[340px] bg-white border-l flex flex-col">
            {/* Filtres et recherche */}
            <div className="flex items-center px-6 py-4 border-b">
              <select className="border rounded px-2 py-1 text-sm mr-2">
                <option>All types</option>
                {/* ...autres options */}
              </select>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
            </div>
            {/* Liste utilisateurs */}
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center px-6 py-3 border-b hover:bg-gray-50"
                >
                  <input type="checkbox" className="mr-2" />
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{user.id}</div>
                    <div className="text-xs text-gray-500">
                      {user.name} | {user.info}
                    </div>
                  </div>
                  {user.online && (
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  )}
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-blue-600">
                      ✏️
                    </button>
                    <button className="text-gray-400 hover:text-blue-600">
                      🔗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
