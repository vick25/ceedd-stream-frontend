import { fetchAllPages } from "@/services/pagination";
import { ceedd } from "@/utils/apiRoutes";
import { API_ENDPOINTS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

// Les inspections, photos et financements ne sont pas inclus dans la réponse
// /infrastructures/{id}/. On charge chaque liste complète UNE fois (cache
// partagé entre toutes les fiches), puis "select" garde seulement les éléments
// de l'infrastructure affichée.

// Un champ relationnel peut arriver comme objet { id, nom } ou comme simple id
const relatedId = (value: any): string | null => {
  if (value == null) return null;
  if (typeof value === "object") return value.id != null ? String(value.id) : null;
  return String(value);
};

export const useInfrastructureInspections = (infraId: string) =>
  useQuery({
    // commence par "inspections" : les invalidations existantes
    // (création / modification d'inspection) rafraîchissent aussi cette liste
    queryKey: ["inspections", "all"],
    queryFn: () => fetchAllPages(`${API_ENDPOINTS.api}${ceedd.inspection}`),
    enabled: !!infraId,
    select: (inspections: any[]) =>
      inspections
        .filter((insp) => relatedId(insp.infrastructure) === infraId)
        // la plus récente d'abord
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
  });

export const useInfrastructurePhotos = (infraId: string) =>
  useQuery({
    queryKey: ["photos", "all"],
    queryFn: () => fetchAllPages(`${API_ENDPOINTS.api}${ceedd.photo}`),
    enabled: !!infraId,
    select: (photos: any[]) =>
      photos.filter(
        (photo) =>
          photo.related_object?.type === "infrastructure" &&
          String(photo.object_id) === infraId,
      ),
  });

export const useInfrastructureFinancements = (infraId: string) =>
  useQuery({
    queryKey: ["bailleurs", "all"],
    queryFn: () => fetchAllPages(`${API_ENDPOINTS.api}${ceedd.bailleur}`),
    enabled: !!infraId,
    // un bailleur porte sa liste de financements : on aplatit en
    // une ligne par financement de CETTE infrastructure
    select: (bailleurs: any[]) =>
      bailleurs.flatMap((bailleur) =>
        (bailleur.finances ?? [])
          .filter((f: any) => relatedId(f.infrastructure) === infraId)
          .map((f: any) => ({ ...f, bailleur })),
      ),
  });
