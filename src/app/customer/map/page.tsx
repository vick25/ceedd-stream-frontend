import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });
import LayerToggles from "@/components/map/LayerToggles";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 grid md:grid-cols-[320px_1fr] gap-4">
      <aside className="bg-white border rounded-lg p-4">
        <LayerToggles />
      </aside>
      <section className="h-[70vh] md:h-[calc(100vh-160px)]">
        <MapView />
      </section>
    </div>
  );
}