// import React from "react";

// interface CylinderGraphProps {
//   current?: number; // Volume actuel mesuré
//   max: number; // Capacité maximale
//   unit?: string; // Unité (par défaut à 'm³')
// }

// export const CylinderGraph: React.FC<CylinderGraphProps> = ({
//   current,
//   max,
//   unit = "L",
// }) => {
//   const volumeCurrent = current !== undefined ? current : 0;
//   // Calcul du pourcentage (Assure une valeur entre 0 et 100)
//   const percentage = Math.min(100, Math.max(0, (volumeCurrent / max) * 100));

//   // Determine color based on percentage
//   const getColor = (pct: number) => {
//     if (pct < 25) return "bg-red-500";
//     if (pct < 50) return "bg-yellow-500";
//     return "bg-blue-500";
//   };

//   // Generate ticks from 10 down to 0 with step of 1
//   const ticks = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex items-start gap-3 mb-2">
//         {/* Cylinder Container */}
//         <div className="relative w-16 h-40 bg-gray-100 border-2 border-gray-300 rounded-full overflow-hidden shadow-inner shrink-0">
//           {/* Internal Tick lines (inchangé) */}
//           <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
//             {ticks.map((tick) => (
//               <div key={tick} className="w-full flex justify-center">
//                 {/* Major ticks (0, 50, 100) are wider/darker, minor ticks are smaller */}
//                 <div
//                   className={`h-px bg-gray-600 ${
//                     tick % 50 === 0 ? "w-full opacity-50" : "w-1/2 opacity-20"
//                   }`}
//                 ></div>
//               </div>
//             ))}
//           </div>

//           {/* Liquid (CORRECTION: Utilisation du style inline pour la hauteur) */}
//           <div
//             className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out z-10 ${getColor(
//               percentage,
//             )} opacity-90`}
//             //Applique la hauteur dynamique directement via le style React
//             style={{ height: `${percentage}%` }}
//           >
//             {/* Surface reflection */}
//             <div className="w-full h-2 bg-white opacity-20 absolute top-0"></div>
//           </div>
//         </div>

//         {/* Axis Labels (inchangé) */}
//         <div className="h-40 py-0.5 flex flex-col justify-between select-none">
//           {ticks.map((tick) => (
//             <div
//               key={tick}
//               className="flex items-center h-0 transform -translate-y-px"
//             >
//               <span className="text-[10px] font-mono text-gray-500 font-medium">
//                 {tick}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/*  Indicateur Textuel de Volume (CORRECTION: current est la variable à afficher) */}
//       <div className="text-center mt-1">
//         <span className="block text-2xl font-bold text-gray-800 leading-tight">
//           {/* Affiche la valeur de 'current' qui représente le volume actuel */}
//           {/* {volumeCurrent} <span className="text-xs text-gray-500">{unit}</span> */}
//         </span>
//         <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
//           {/* Volume ({percentage.toFixed(0)}% Rempli) */}
//           Volume ({volumeCurrent} {unit})
//         </span>
//       </div>
//     </div>
//   );
// };

import React from "react";

interface CylinderGraphProps {
  current?: number;
  max: number;
  unit?: string;
}

export const CylinderGraph: React.FC<CylinderGraphProps> = ({
  current,
  max,
  unit = "L",
}) => {
  const volumeCurrent = current ?? 0;
  const percentage = Math.min(100, Math.max(0, (volumeCurrent / max) * 100));

  const getColor = (pct: number) => {
    if (pct < 25) return "bg-red-500";
    if (pct < 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  // On génère 11 paliers (de 0% à 100% de la capacité max)
  // Si max = 5000, les paliers seront : 5000, 4500, 4000... 0
  const tickLabels = Array.from({ length: 11 }, (_, i) =>
    Math.round((max / 10) * (10 - i))
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-start gap-4 mb-2">
        {/* Cylindre */}
        <div className="relative w-16 h-48 bg-gray-100 border-2 border-gray-300 rounded-full overflow-hidden shadow-inner shrink-0">
          {/* Lignes de graduation (10 segments) */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between py-[2px] pointer-events-none">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="w-full flex justify-center">
                <div className="h-px bg-gray-400 w-1/2 opacity-30"></div>
              </div>
            ))}
          </div>

          {/* Liquide Dynamique */}
          <div
            className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out z-10 ${getColor(
              percentage
            )} opacity-90`}
            style={{ height: `${percentage}%` }}
          >
            <div className="w-full h-2 bg-white opacity-20 absolute top-0"></div>
          </div>
        </div>

        {/* Axe des ordonnées dynamique */}
        <div className="h-48 flex flex-col justify-between py-[2px] select-none">
          {tickLabels.map((val, i) => (
            <div key={i} className="flex items-center h-0">
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Libellé de volume */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
          Volume actuel
        </span>
        <div className="text-xl font-black text-gray-800">
          {volumeCurrent.toLocaleString()}{" "}
          <span className="text-sm font-normal">{unit}</span>
        </div>
        <div className="text-[10px] text-blue-600 font-bold">
          {percentage.toFixed(1)}% de la capacité ({max} {unit})
        </div>
      </div>
    </div>
  );
};
