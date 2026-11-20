import API from "./api";

// Récupère TOUTES les pages d'un endpoint paginé (Django REST, limit/offset).
// Utile quand on doit retrouver des éléments liés (inspections, photos…)
// qui peuvent se trouver sur n'importe quelle page de l'API.
export async function fetchAllPages<T = any>(
  path: string,
  { limit = 100, maxPages = 200 }: { limit?: number; maxPages?: number } = {},
): Promise<T[]> {
  let offset = 0;
  let pages = 0;
  let all: T[] = [];

  while (pages < maxPages) {
    const { data } = await API.get(path, { params: { limit, offset } });

    // Endpoint non paginé : l'API renvoie directement un tableau
    if (Array.isArray(data)) return data;

    all = all.concat(data?.results ?? []);
    pages += 1;
    if (!data?.next) break; // dernière page atteinte
    offset += limit;
  }
  return all;
}
