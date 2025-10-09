export default function LocaleHome() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenue</h1>
      <p className="text-gray-600">
        Utilisez la navigation pour accéder à la carte et au tableau de bord.
      </p>
      <div className="flex gap-3">
        <a className="px-4 py-2 rounded bg-blue-600 text-white" href="./map">Ouvrir la carte</a>
        <a className="px-4 py-2 rounded border" href="./dashboard">Ouvrir le tableau de bord</a>
      </div>
    </div>
  );
}