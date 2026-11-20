"use client";

import EditCustomer from "@/components/editButton/EditCustomer";
import Loader from "@/components/Loader";
import { useGetCustomerById } from "@/hooks/useCustomer";
import { useAppStore } from "@/store/appStore";
import { Client } from "@/types/infrastructure";
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  MapPin,
  Phone,
  User,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// Le type Client ne déclare que les champs de base ; le formulaire de création
// en envoie d'autres, qu'on ajoute ici en optionnels.
type ClientDetails = Client & {
  postnom?: string | null;
  titre?: string | null;
  engagement?: boolean | string | null;
  numero?: string | null;
  telephone?: string | null;
  email?: string | null;
};

// Affiche "—" quand une valeur est vide, plutôt qu'un trou dans la page
const show = (value?: string | null) =>
  value && String(value).trim() !== "" ? value : "—";

const formatSexe = (sexe?: string | null) =>
  sexe === "M" ? "Homme" : sexe === "F" ? "Femme" : show(sexe);

// engagement vient d'une case à cocher : selon le backend, true/false ou "true"/"false"
const isEngaged = (value: ClientDetails["engagement"]) =>
  value === true || value === "true";

// Ligne "libellé : valeur" réutilisée dans toutes les sections
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
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-900">
      <span className="text-blue-600">{icon}</span>
      {title}
    </h2>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
  </section>
);

const ClientDetailsPage = () => {
  // useParams lit le segment dynamique [id] de l'URL /dashboard/clients/[id]
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const { data, isPending, isError } = useGetCustomerById(id);
  const client = data as ClientDetails | undefined;

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) return <Loader />;
  if (!isAuthenticated || !user) return null;
  if (isPending) return <Loader />;

  const backLink = (
    <Link
      href="/dashboard/clients"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
    >
      <ArrowLeft className="h-4 w-4" /> Retour à la liste des clients
    </Link>
  );

  // id inexistant ou erreur réseau : message clair au lieu d'une page vide
  if (isError || !client) {
    return (
      <main className="container space-y-6 py-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm">
          <UserX className="h-10 w-10 text-gray-400" />
          <h1 className="text-lg font-semibold text-gray-900">
            Client introuvable
          </h1>
          <p className="text-sm text-gray-500">
            Ce client n'existe pas ou a été supprimé.
          </p>
        </div>
      </main>
    );
  }

  const fullName = [client.nom, client.postnom, client.prenom]
    .filter(Boolean)
    .join(" ");
  // Initiales pour l'avatar : première lettre du nom et du prénom
  const initials = `${client.nom?.[0] ?? ""}${client.prenom?.[0] ?? ""}`.toUpperCase();
  const address = [
    client.numero && `N° ${client.numero}`,
    client.avenue,
    client.quartier,
    client.commune,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="container space-y-6 py-6">
      {backLink}

      {/* En-tête : identité + action de modification */}
      <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
            {initials || <User className="h-7 w-7" />}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {client.titre ? `${client.titre} ` : ""}
              {fullName || "Client sans nom"}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {formatSexe(client.sexe)}
              </span>
              {client.commune && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {client.commune}
                </span>
              )}
              {isEngaged(client.engagement) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <BadgeCheck className="h-3.5 w-3.5" /> Engagé
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Même composant que dans la table : après modification, il invalide
            ["customers"], ce qui recharge aussi cette fiche */}
        <EditCustomer
          id={client.id}
          nom={client.nom}
          prenom={client.prenom}
          sexe={client.sexe}
          avenue={client.avenue}
          quartier={client.quartier}
          commune={client.commune}
        />
      </div>

      <Section title="Identité" icon={<User className="h-5 w-5" />}>
        <Field label="Nom">{show(client.nom)}</Field>
        <Field label="Postnom">{show(client.postnom)}</Field>
        <Field label="Prénom">{show(client.prenom)}</Field>
        <Field label="Sexe">{formatSexe(client.sexe)}</Field>
        <Field label="Titre">{show(client.titre)}</Field>
        <Field label="Engagement">
          {isEngaged(client.engagement) ? "Oui" : "Non"}
        </Field>
      </Section>

      <Section title="Contact" icon={<Phone className="h-5 w-5" />}>
        <Field label="Téléphone">
          {client.telephone ? (
            <a
              href={`tel:${client.telephone}`}
              className="text-blue-600 hover:underline"
            >
              {client.telephone}
            </a>
          ) : (
            "—"
          )}
        </Field>
        <Field label="E-mail">
          {client.email ? (
            <a
              href={`mailto:${client.email}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Mail className="h-4 w-4" />
              {client.email}
            </a>
          ) : (
            "—"
          )}
        </Field>
      </Section>

      <Section title="Adresse" icon={<MapPin className="h-5 w-5" />}>
        <Field label="Numéro">{show(client.numero)}</Field>
        <Field label="Avenue">{show(client.avenue)}</Field>
        <Field label="Quartier">{show(client.quartier)}</Field>
        <Field label="Commune">{show(client.commune)}</Field>
        <div className="sm:col-span-2">
          <Field label="Adresse complète">{show(address)}</Field>
        </div>
      </Section>
    </main>
  );
};

export default ClientDetailsPage;
