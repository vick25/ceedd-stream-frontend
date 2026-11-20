"use client";

import {
  EmptyState,
  Field,
  formatDate,
  formatNumber,
  humanizeKey,
  isEmpty,
  relatedId,
  Section,
  show,
  StatCard,
} from "@/components/details/DetailBlocks";
import EditBailleur from "@/components/editButton/EditBailleur";
import Loader from "@/components/Loader";
import { useGetBailleurById } from "@/hooks/useBailleur";
import { useAllInfrastructures } from "@/hooks/useInfrastructure";
import { useRelatedPhotos } from "@/hooks/useInfrastructureDetails";
import {
  ArrowLeft,
  Building2,
  CalendarRange,
  Eye,
  HandCoins,
  ImageIcon,
  Info,
  Landmark,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Champs déjà affichés : tout autre champ simple renvoyé par l'API
// apparaît dans "Autres informations".
const DISPLAYED_KEYS = new Set(["id", "nom", "sigle", "finances"]);

const BailleurDetailsPage = () => {
  // /dashboard/bailleurs/[id] → { id: "4" }
  const id = useParams().id as string;

  const { data: bailleur, isPending, isError } = useGetBailleurById(id);
  // photos rattachées au bailleur (son logo, en pratique)
  const { data: photos = [] } = useRelatedPhotos("bailleur", id);
  // pour afficher le type, la capacité… de chaque infrastructure financée,
  // le financement ne contenant que son id (ou son nom)
  const { data: infrastructures = [] } = useAllInfrastructures();

  // (la connexion est vérifiée par AuthGuard dans dashboard/layout.tsx)
  if (isPending) return <Loader />;

  const backLink = (
    <Link
      href="/dashboard/bailleurs"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
    >
      <ArrowLeft className="h-4 w-4" /> Retour aux bailleurs
    </Link>
  );

  if (isError || !bailleur) {
    return (
      <main className="container space-y-6 py-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm">
          <Landmark className="h-10 w-10 text-gray-400" />
          <h1 className="text-lg font-semibold">Bailleur introuvable</h1>
          <p className="text-sm text-gray-500">
            Il n&apos;existe pas ou a été supprimé.
          </p>
        </div>
      </main>
    );
  }

  /* ---- Financements enrichis avec l'infrastructure complète ---- */
  // Map id → infrastructure : retrouver une infrastructure en O(1)
  // au lieu de parcourir toute la liste pour chaque financement.
  const infraById = new Map(
    infrastructures.map((infra: any) => [String(infra.id), infra]),
  );

  const financements = (bailleur.finances ?? [])
    .map((f: any) => {
      const infraId = relatedId(f.infrastructure);
      return {
        ...f,
        infraId,
        // objet complet si on l'a, sinon ce que l'API a fourni
        infra:
          (infraId && infraById.get(infraId)) ||
          (typeof f.infrastructure === "object" ? f.infrastructure : null),
      };
    })
    // plus récent d'abord
    .sort(
      (a: any, b: any) =>
        new Date(b.date_financement ?? 0).getTime() -
        new Date(a.date_financement ?? 0).getTime(),
    );

  /* ---- Chiffres clés ---- */
  // Number(...) || 0 : un montant vide ou invalide compte pour 0
  const totalMontant = financements.reduce(
    (sum: number, f: any) => sum + (Number(f.montant) || 0),
    0,
  );
  const hasMontants = financements.some((f: any) => !isEmpty(f.montant));
  // une même infrastructure peut être financée plusieurs fois : Set = dédoublonnage
  const nbInfrastructures = new Set(
    financements.map((f: any) => f.infraId).filter(Boolean),
  ).size;
  const dates = financements
    .map((f: any) => f.date_financement)
    .filter(Boolean)
    .sort();
  const periode =
    dates.length === 0
      ? "—"
      : dates.length === 1
        ? formatDate(dates[0])
        : `${new Date(dates[0]).getFullYear()} – ${new Date(dates[dates.length - 1]).getFullYear()}`;

  const logo = photos[0]?.url;
  const initials = (bailleur.sigle || bailleur.nom || "?")
    .slice(0, 3)
    .toUpperCase();

  const extraFields = Object.entries(bailleur).filter(
    ([key, value]) =>
      !DISPLAYED_KEYS.has(key) && (value === null || typeof value !== "object"),
  );

  return (
    <main className="container space-y-6 py-6">
      {backLink}

      {/* ---------- En-tête ---------- */}
      <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-blue-50">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={`Logo ${bailleur.nom}`}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="text-lg font-bold text-blue-700">{initials}</span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Bailleur de fonds
            </p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {bailleur.nom}
            </h1>
            {bailleur.sigle && (
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                {bailleur.sigle}
              </span>
            )}
          </div>
        </div>
        {/* invalide ["bailleurs"] après enregistrement → la fiche se recharge */}
        <EditBailleur id={bailleur.id} nom={bailleur.nom} sigle={bailleur.sigle} />
      </div>

      {/* ---------- Chiffres clés ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Infrastructures financées"
          value={nbInfrastructures}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Montant total"
          value={hasMontants ? formatNumber(totalMontant) : "—"}
        />
        <StatCard
          icon={<CalendarRange className="h-5 w-5" />}
          label="Période de financement"
          value={periode}
        />
      </div>

      {/* ---------- Financements ---------- */}
      <Section
        title={`Financements (${financements.length})`}
        icon={<HandCoins className="h-5 w-5" />}
      >
        {financements.length === 0 ? (
          <EmptyState>Aucun financement enregistré pour ce bailleur.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-2 pr-4 font-medium">Infrastructure</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Capacité</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 text-right font-medium">Montant</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">Voir</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {financements.map((f: any, i: number) => (
                  <tr key={f.id ?? i}>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {f.infra?.nom ?? (f.infraId ? `#${f.infraId}` : "—")}
                    </td>
                    <td className="py-3 pr-4">
                      {show(f.infra?.type_infrastructure?.nom)}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      {isEmpty(f.infra?.capacite)
                        ? "—"
                        : `${formatNumber(f.infra.capacite)} ${f.infra.unite ?? ""}`}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4">
                      {formatDate(f.date_financement)}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-right">
                      {formatNumber(f.montant)} {f.devise ?? ""}
                    </td>
                    <td className="py-3">
                      {f.infraId && (
                        <Link
                          href={`/dashboard/shows/${f.infraId}`}
                          aria-label="Voir l'infrastructure"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ---------- Photos / logos (s'il y en a plusieurs) ---------- */}
      {photos.length > 1 && (
        <Section
          title={`Images (${photos.length})`}
          icon={<ImageIcon className="h-5 w-5" />}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {photos.map((photo: any) => (
              <a
                key={photo.id}
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-gray-100 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.description || bailleur.nom}
                  loading="lazy"
                  className="aspect-square w-full object-contain p-2"
                />
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- Champs supplémentaires renvoyés par l'API ---------- */}
      {extraFields.length > 0 && (
        <Section title="Autres informations" icon={<Info className="h-5 w-5" />}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {extraFields.map(([key, value]) => (
              <div key={key}>
                <Field label={humanizeKey(key)}>
                  {typeof value === "boolean"
                    ? value
                      ? "Oui"
                      : "Non"
                    : show(value)}
                </Field>
              </div>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
};

export default BailleurDetailsPage;
