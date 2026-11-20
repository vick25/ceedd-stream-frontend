import { useRef, useState } from "react";

// Logique de pagination locale partagée par toutes les tables.
// Avant, chaque table recopiait : état de page, calcul du nombre de pages,
// slice(), boutons… Ici une seule fois, et <DataPagination> pour l'affichage.
//
// Usage :
//   const { pageItems, paginationProps, topRef } = usePagination(liste);
//   <div ref={topRef}> … pageItems.map(…) … <DataPagination {...paginationProps} />
export function usePagination<T>(items: T[], initialPageSize = 30) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // élément en haut de la table : on y remonte quand on change de page
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  // Page « sûre » calculée, pas stockée : si une suppression ou un filtre
  // réduit la liste, on ne reste jamais sur une page qui n'existe plus.
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    page: currentPage,
    setPage, // ex. setPage(1) quand la recherche change
    pageSize,
    pageItems,
    topRef,
    // à passer tel quel : <DataPagination {...paginationProps} />
    paginationProps: {
      page: currentPage,
      pageSize,
      totalItems: items.length,
      onPageChange: goToPage,
      onPageSizeChange: changePageSize,
    },
  };
}
