"use client";

import Loader from "@/components/Loader";
import { useGetInfrastructureById } from "@/hooks/useInfrastructure";
import {
  useInfrastructureFinancements,
  useInfrastructureInspections,
  useInfrastructurePhotos,
} from "@/hooks/useInfrastructureDetails";
import { useZoneContributives } from "@/hooks/useZoneContributive";
import {
  ArrowLeft,
  Calendar,
  ClipboardCheck,
  Droplets,
  ExternalLink,
  HandCoins,
  ImageIcon,
  Info,
  MapPin,
  Ruler,
  User,
  Warehouse,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

// Leaflet utilise "window" : la carte ne peut être rendue que dans le
// navigateur, d'où ssr: false.
const LocationMap = dynamic(
  () => import("@/components/InfrastructureLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
    ),
  },
);

/* ------------------------------------------------------------------ */
/* Helpers d'affichage                                                  */
/* ------------------------------------------------------------------ */

const isEmpty = (v: unknown) =>
  v === null || v === undefined || String(v).trim() === "";
const show = (v: unknown) => (isEmpty(v) ? "—" : String(v));

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};

const formatNumber = (value: unknown) => {
  const n = Number(value);
  return isEmpty(value) || isNaN(n) ? show(value) : n.toLocaleString("fr-FR");
};

// m3 → m³, m2 → m²
const formatUnit = (unit?: string | null) =>
  unit ? unit.replace(/3$/, "³").replace(/2$/, "²") : "";

const ETAT_STYLES: Record<string, string> = {
  bon: "bg-green-100 text-green-700",
  moyen: "bg-yellow-100 text-yellow-700",
  mauvais: "bg-red-100 text-red-700",
};

const EtatBadge = ({ etat }: { etat?: string | null }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      ETAT_STYLES[String(etat ?? "").toLowerCase()] ??
      "bg-gray-100 text-gray-600"
    }`}
  >
    {etat || "Non inspectée"}
  </span>
);

// Champs déjà affichés dans les sections : tout AUTRE champ simple renvoyé par
// l'API apparaît dans "Autres informations", pour ne rien perdre.
const DISPLAYED_KEYS = new Set([
  "id",
  "nom",
  "type_infrastructure",
  "date_construction",
  "latitude",
  "longitude",
  "capacite",
  "unite",
  "zone",
  "client",
  "current_volume",
  "last_update_date",
  "city",
]);

const humanizeKey = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/* ------------------------------------------------------------------ */
/* Petits composants de mise en page                                    */
/* ------------------------------------------------------------------ */

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-sm text-gray-900">{children}</span>
  </div>
);

const Section = ({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="truncate text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ children }: { children: ReactNode }) => (
  <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-500">
    {children}
  </p>
);

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

const InfrastructureDetailsPage = () => {
  // /dashboard/shows/[id] → useParams() donne { id: "12" }
  const id = useParams().id as string;

  // Requêtes lancées en parallèle : chaque section s'affiche dès que ses
  // propres données arrivent.
  const { data: infra, isPending, isError } = useGetInfrastructureById(id);
  const { data: inspections = [], isPending: inspLoading } =
    useInfrastructureInspections(id);
  const { data: photos = [], isPending: photosLoading } =
    useInfrastructurePhotos(id);
  const { data: financements = [], isPending: finLoading } =
    useInfrastructureFinancements(id);
  const { data: zonesData } = useZoneContributives();

  // (la connexion est vérifiée par AuthGuard dans dashboard/layout.tsx)
  if (isPending) return <Loader />;

  const backLink = (
    <Link
      href="/dashboard/infrastructures"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
    >
      <ArrowLeft className="h-4 w-4" /> Retour aux infrastructures
    </Link>
  );

  if (isError || !infra) {
    return (
      <main className="container space-y-6 py-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm">
          <Warehouse className="h-10 w-10 text-gray-400" />
          <h1 className="text-lg font-semibold">Infrastructure introuvable</h1>
          <p className="text-sm text-gray-500">
            Elle n&apos;existe pas ou a été supprimée.
          </p>
        </div>
      </main>
    );
  }

  /* ---- Données dérivées ---- */
  const unit = formatUnit(infra.unite);
  const lastInspection = inspections[0]; // déjà triées, la plus récente d'abord

  const lat = Number(infra.latitude);
  const lng = Number(infra.longitude);
  const hasCoords =
    !isEmpty(infra.latitude) &&
    !isEmpty(infra.longitude) &&
    !isNaN(lat) &&
    !isNaN(lng);

  // client et zone : objet complet OU simple id selon l'API
  const client = typeof infra.client === "object" ? infra.client : null;
  const zone =
    infra.zone && typeof infra.zone === "object"
      ? infra.zone
      : zonesData?.results?.find(
          (z: any) => String(z.id) === String(infra.zone),
        );

  const extraFields = Object.entries(infra).filter(
    ([key, value]) =>
      !DISPLAYED_KEYS.has(key) &&
      (value === null || typeof value !== "object"), // champs simples seulement
  );

  return (
    <main className="container space-y-6 py-6">
      {backLink}

      {/* ---------- En-tête ---------- */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {infra.type_infrastructure?.nom ?? "Infrastructure"}
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {infra.nom || "Sans nom"}
          </h1>
          <p className="text-sm text-gray-500">Identifiant #{infra.id}</p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="text-xs text-gray-400">État actuel</span>
          {inspLoading ? (
            <span className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : (
            <EtatBadge etat={lastInspection?.etat} />
          )}
        </div>
      </div>

      {/* ---------- Chiffres clés ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Ruler className="h-5 w-5" />}
          label="Capacité"
          value={`${formatNumber(infra.capacite)} ${unit}`}
        />
        <StatCard
          icon={<Droplets className="h-5 w-5" />}
          label="Volume actuel"
          value={
            isEmpty(infra.current_volume)
              ? "—"
              : `${formatNumber(infra.current_volume)} ${unit}`
          }
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Construction"
          value={formatDate(infra.date_construction)}
        />
        <StatCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Dernière inspection"
          value={inspLoading ? "…" : formatDate(lastInspection?.date)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---------- Caractéristiques ---------- */}
        <Section title="Caractéristiques" icon={<Info className="h-5 w-5" />}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nom">{show(infra.nom)}</Field>
            <Field label="Type">{show(infra.type_infrastructure?.nom)}</Field>
            <Field label="Capacité">
              {formatNumber(infra.capacite)} {unit}
            </Field>
            <Field label="Unité">{show(infra.unite)}</Field>
            <Field label="Date de construction">
              {formatDate(infra.date_construction)}
            </Field>
            <Field label="Zone contributive">
              {zone ? (
                <>
                  {zone.nom}
                  {zone.superficie ? ` — ${formatNumber(zone.superficie)} m²` : ""}
                </>
              ) : (
                show(typeof infra.zone === "object" ? null : infra.zone)
              )}
            </Field>
            {zone?.etat_ravin && (
              <Field label="État du ravin">{zone.etat_ravin}</Field>
            )}
            <Field label="Dernière mise à jour">
              {formatDate(infra.last_update_date)}
            </Field>
          </div>
        </Section>

        {/* ---------- Propriétaire ---------- */}
        <Section
          title="Propriétaire"
          icon={<User className="h-5 w-5" />}
          action={
            client?.id ? (
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Voir la fiche
              </Link>
            ) : null
          }
        >
          {client ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nom complet">
                {[client.nom, client.postnom, client.prenom]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </Field>
              <Field label="Sexe">
                {client.sexe === "M"
                  ? "Homme"
                  : client.sexe === "F"
                    ? "Femme"
                    : show(client.sexe)}
              </Field>
              <Field label="Téléphone">{show(client.telephone)}</Field>
              <Field label="Adresse">
                {[client.avenue, client.quartier, client.commune]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </Field>
            </div>
          ) : (
            <EmptyState>Aucun propriétaire assigné.</EmptyState>
          )}
        </Section>
      </div>

      {/* ---------- Localisation ---------- */}
      <Section
        title="Localisation"
        icon={<MapPin className="h-5 w-5" />}
        action={
          hasCoords ? (
            <a
              href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Ouvrir la carte <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
            <Field label="Latitude">{show(infra.latitude)}</Field>
            <Field label="Longitude">{show(infra.longitude)}</Field>
            {!isEmpty(infra.city) && <Field label="Ville">{infra.city}</Field>}
          </div>
          <div className="lg:col-span-2">
            {hasCoords ? (
              <LocationMap lat={lat} lng={lng} />
            ) : (
              <EmptyState>Coordonnées non renseignées.</EmptyState>
            )}
          </div>
        </div>
      </Section>

      {/* ---------- Inspections ---------- */}
      <Section
        title={`Inspections (${inspLoading ? "…" : inspections.length})`}
        icon={<ClipboardCheck className="h-5 w-5" />}
      >
        {inspLoading ? (
          <EmptyState>Chargement…</EmptyState>
        ) : inspections.length === 0 ? (
          <EmptyState>Aucune inspection enregistrée.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">État</th>
                  <th className="py-2 pr-4 font-medium">Inspecteur</th>
                  <th className="py-2 pr-4 font-medium">Commentaire</th>
                  <th className="py-2 font-medium">Prochain contrôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inspections.map((insp: any) => (
                  <tr key={insp.id}>
                    <td className="whitespace-nowrap py-3 pr-4">
                      {formatDate(insp.date)}
                    </td>
                    <td className="py-3 pr-4">
                      <EtatBadge etat={insp.etat} />
                    </td>
                    <td className="py-3 pr-4">{show(insp.inspecteur)}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {show(insp.commentaire)}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      {formatDate(insp.prochain_controle)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ---------- Financement ---------- */}
      <Section
        title="Financement"
        icon={<HandCoins className="h-5 w-5" />}
      >
        {finLoading ? (
          <EmptyState>Chargement…</EmptyState>
        ) : financements.length === 0 ? (
          <EmptyState>Aucun financement enregistré.</EmptyState>
        ) : (
          <ul className="divide-y divide-gray-100">
            {financements.map((f: any, i: number) => (
              <li
                key={f.id ?? i}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-gray-900">
                  {f.bailleur?.nom}
                  {f.bailleur?.sigle ? ` (${f.bailleur.sigle})` : ""}
                </span>
                <span className="text-sm text-gray-600">
                  {isEmpty(f.montant) ? "" : `${formatNumber(f.montant)} `}
                  {f.devise ?? ""}
                  {f.date_financement
                    ? ` · ${formatDate(f.date_financement)}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ---------- Photos ---------- */}
      <Section
        title={`Photos (${photosLoading ? "…" : photos.length})`}
        icon={<ImageIcon className="h-5 w-5" />}
      >
        {photosLoading ? (
          <EmptyState>Chargement…</EmptyState>
        ) : photos.length === 0 ? (
          <EmptyState>Aucune photo pour cette infrastructure.</EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo: any) => (
              // clic = image en taille réelle dans un nouvel onglet
              <a
                key={photo.id}
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-lg border border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.description || infra.nom}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition group-hover:scale-105"
                />
                {(photo.description || photo.date_prise) && (
                  <div className="p-2 text-xs text-gray-500">
                    {photo.description && <p>{photo.description}</p>}
                    {photo.date_prise && <p>{formatDate(photo.date_prise)}</p>}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </Section>

      {/* ---------- Champs supplémentaires renvoyés par l'API ---------- */}
      {extraFields.length > 0 && (
        <Section
          title="Autres informations"
          icon={<Info className="h-5 w-5" />}
        >
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

export default InfrastructureDetailsPage;
