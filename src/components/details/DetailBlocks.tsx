import { ReactNode } from "react";

// Blocs d'affichage partagés par les fiches de détail
// (infrastructure, bailleur…) : même apparence partout, un seul endroit à modifier.

export const isEmpty = (v: unknown) =>
  v === null || v === undefined || String(v).trim() === "";

// "—" plutôt qu'un trou quand une valeur manque
export const show = (v: unknown) => (isEmpty(v) ? "—" : String(v));

export const formatDate = (value?: string | null) => {
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

// 1250000 → "1 250 000" ; renvoie la valeur brute si ce n'est pas un nombre
export const formatNumber = (value: unknown) => {
  const n = Number(value);
  return isEmpty(value) || isNaN(n) ? show(value) : n.toLocaleString("fr-FR");
};

export const humanizeKey = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// Un champ relationnel peut arriver comme objet { id, nom } ou comme simple id
export const relatedId = (value: any): string | null => {
  if (value == null) return null;
  if (typeof value === "object")
    return value.id != null ? String(value.id) : null;
  return String(value);
};

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-sm text-gray-900">{children}</span>
  </div>
);

export const Section = ({
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

export const StatCard = ({
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

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <p className="rounded-lg bg-gray-50 py-6 text-center text-sm text-gray-500">
    {children}
  </p>
);
