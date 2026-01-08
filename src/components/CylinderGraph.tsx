import React from "react";

interface CylinderGraphProps {
  current?: number;
  unit?: string;
}

export const CylinderGraph: React.FC<CylinderGraphProps> = ({
  current = 0,
  unit = "L",
}) => {
  // ÉTAPE 1 : On définit que le haut du cylindre (le chiffre 10) vaut toujours 10 000
  const THEORETICAL_MAX = 10000;

  // ÉTAPE 2 : Calcul du pourcentage par rapport à 10 000
  // Si current = 3000, percentage = 30% (donc aligné sur le chiffre 3)
  const percentage = Math.min(
    100,
    Math.max(0, (current / THEORETICAL_MAX) * 100)
  );

  // ÉTAPE 3 : Logique de couleur demandée
  const getColor = (pct: number) => {
    if (pct <= 30) return "bg-red-500"; // S'arrête à 3 ou moins -> Rouge
    if (pct >= 90) return "bg-blue-600"; // S'arrête à 9 ou plus -> Bleu
    return "bg-yellow-500"; // Entre les deux -> Jaune
  };

  const staticTicks = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div className="flex flex-col items-center p-2 bg-white rounded-lg inline-block">
      <div className="flex items-start gap-3">
        {/* Cylindre - Plus fin (w-12) et bordure légère */}
        <div className="relative w-12 h-60 bg-gray-50 border border-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Lignes de repère très fines */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between py-1 pointer-events-none">
            {staticTicks.map((t) => (
              <div key={t} className="w-full flex justify-center">
                <div
                  className={`h-[1px] bg-gray-300 ${
                    t % 5 === 0 ? "w-1/2 opacity-70" : "w-1/4 opacity-30"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Liquide dynamique */}
          <div
            className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out z-10 ${getColor(
              percentage
            )}`}
            style={{ height: `${percentage}%` }}
          >
            {/* Brillance en haut du liquide */}
            <div className="w-full h-2 bg-white/20 absolute top-0 blur-[1px]"></div>
          </div>
        </div>

        {/* Échelle 0-10 - Texte plus petit et élégant */}
        <div className="h-60 flex flex-col justify-between py-1 select-none">
          {staticTicks.map((tick) => (
            <div key={tick} className="flex items-center h-0">
              <span className="text-[10px] font-medium text-gray-400 font-mono">
                {tick}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Affichage de la valeur réelle - Taille équilibrée */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-gray-800 tracking-tight leading-none">
          {current?.toLocaleString()}
        </div>
        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
          {unit} ACTUEL
        </div>
      </div>
    </div>
  );
};
