"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Pagination réutilisable pour toutes les tables du dashboard
// (clients, infrastructures, inspections, bailleurs…).
// Elle n'a AUCUN état propre : la table garde la page et la taille, et la
// pagination se contente d'afficher et de prévenir quand on clique
// (composant « contrôlé », comme un <input value onChange>).

type PageItem = number | "ellipsis-start" | "ellipsis-end";

// Calcule les numéros à afficher, toujours 7 éléments au maximum :
//   9 pages, page 1 →  1 2 3 4 5 … 9
//   9 pages, page 5 →  1 … 4 5 6 … 9
//   9 pages, page 9 →  1 … 5 6 7 8 9
// Exportée pour pouvoir la tester ou la réutiliser seule.
export function getPageRange(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", total];
  if (current >= total - 3)
    return [1, "ellipsis-start", total - 4, total - 3, total - 2, total - 1, total];
  return [
    1,
    "ellipsis-start",
    current - 1,
    current,
    current + 1,
    "ellipsis-end",
    total,
  ];
}

interface DataPaginationProps {
  page: number; // page courante, à partir de 1
  pageSize: number; // nombre de lignes par page
  totalItems: number; // nombre total d'éléments (après filtre)
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void; // absent = pas de sélecteur
  pageSizeOptions?: number[];
  itemLabel?: string; // "clients", "infrastructures"…
  className?: string;
}

const fmt = (n: number) => n.toLocaleString("fr-FR"); // 1250 → "1 250"

export function DataPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 30, 50, 100],
  itemLabel = "éléments",
  className,
}: DataPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  // "from–to" : position des éléments affichés (0–0 si la liste est vide)
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const goTo = (p: number) => {
    const target = Math.min(Math.max(p, 1), totalPages); // reste dans [1, total]
    if (target !== page) onPageChange(target);
  };

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40";
  const idleBtn = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-gray-100 px-2 py-4 sm:px-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      {/* Résumé : "31–60 sur 247 clients" */}
      <p className="text-center text-sm text-gray-500 lg:text-left" aria-live="polite">
        <span className="font-semibold text-gray-900">
          {fmt(from)}–{fmt(to)}
        </span>{" "}
        sur {fmt(totalItems)} {itemLabel}
      </p>

      {/* <nav> + aria-label : les lecteurs d'écran l'annoncent comme une pagination */}
      <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
          className={cn(baseBtn, idleBtn)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {/* Numéros : visibles à partir de la taille "sm" */}
        <div className="hidden items-center gap-1 sm:flex">
          {getPageRange(page, totalPages).map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                // aria-current : indique la page active aux technologies d'assistance
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  baseBtn,
                  item === page
                    ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                    : idleBtn,
                )}
              >
                {item}
              </button>
            ) : (
              <span
                key={item} // "ellipsis-start" / "ellipsis-end" : clés uniques
                className="px-1 text-sm text-gray-400"
                aria-hidden="true"
              >
                …
              </span>
            ),
          )}
        </div>

        {/* Sur mobile, les numéros ne tiennent pas : simple "3 / 9" */}
        <span className="px-3 text-sm text-gray-600 sm:hidden">
          <span className="font-semibold text-gray-900">{page}</span> / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Page suivante"
          className={cn(baseBtn, idleBtn)}
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>

      {onPageSizeChange && (
        <label className="flex items-center justify-center gap-2 text-sm text-gray-500">
          Lignes par page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
