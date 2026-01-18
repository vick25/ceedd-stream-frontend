import DeleteInfrastructure from "@/components/deleteButton/DeleteInfrastructure";
import { useCustomers } from "@/components/hooks/useCustomer";

import EditCustomer from "@/components/editButton/EditCustomer";
import Loader from "@/components/Loader";
import { Client } from "@/types/infrastructure";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteCustomer from "@/components/deleteButton/DeleteCustomer";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { Locale, useTranslations } from "next-intl";
import { Button } from "../button";

export default function ClientTable() {
  const [getClients, setGetClients] = useState<Client[]>([]);
  const [customerDelete, setCustomerDeleted] = useState<string>("");
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeInfras, setTypeInfras] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const [infrastructureDeleted, setInfrastructureDeleted] =
    useState<string>("");

  const [isOpen, setIsOpen] = useState(false);
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  // initialize mutation
  const { data: customers, isPending: customersIspending } = useCustomers();
  const pageItems = 30;
  //useEffect
  const allResults = customers?.results || [];
  const totalPages = Math.ceil(allResults.length / pageItems);
  const tabIndex = (currentPage - 1) * pageItems;
  const pageCustomers = allResults.slice(tabIndex, tabIndex + pageItems);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }
  if (customersIspending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden space-y-4 px-2">
            {pageCustomers.map((customer: any) => (
              <div
                key={customer.id}
                className="relative w-full rounded-xl bg-white p-5 shadow-sm border border-gray-100"
              >
                {/* Header : Nom et Prénom */}
                <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Client
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.nom} {customer.prenom}
                    </h3>
                    <span className="text-sm text-gray-500 italic">
                      {customer.sexe}
                    </span>
                  </div>

                  {/* Lien de vue rapide (Icon Eye) */}
                  <Link
                    href={`/dashboard/clients/${customer.id}`}
                    className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>

                {/* Body : Adresse */}
                <div className="py-4">
                  <span className="text-xs font-medium text-gray-400">
                    Localisation
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed mt-1">
                    {customer.avenue}, {customer.quartier}, <br />
                    <span className="font-medium text-gray-900">
                      {customer.commune}
                    </span>
                  </p>
                </div>

                {/* Footer : Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
                  <EditCustomer
                    id={customer.id}
                    nom={customer.nom}
                    prenom={customer.prenom}
                    sexe={customer.sexe}
                    avenue={customer.avenue}
                    quartier={customer.quartier}
                    commune={customer.commune}
                  />
                  <DeleteCustomer
                    id={customer.id}
                    nom={customer.nom}
                    setCustomerDeleted={setCustomerDeleted}
                  />
                </div>
              </div>
            ))}

            {/* Pagination Mobile */}
            <div className="flex flex-col items-center gap-4 py-6">
              <span className="text-sm text-gray-500 font-medium">
                Page <span className="text-blue-600">{currentPage}</span> sur{" "}
                {totalPages}
              </span>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex-1 px-8 rounded-full border-blue-200 shadow-sm"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex-1 px-8 rounded-full border-blue-200 shadow-sm"
                >
                  Suivant <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <table className="hidden  min-w-full text-gray-900  lg:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Noms
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Prénom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sexe
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Adresse
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageCustomers.length > 0 ? (
                pageCustomers.map((infra: any) => {
                  //jointure

                  // const zone = zones[infra?.zone?.toString()];
                  return (
                    <tr
                      key={infra.id}
                      className="w-full border-b border-b-gray-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {/* <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                          {infra.nom}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.prenom}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.sexe}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {" "}
                        {infra.avenue}, {infra.quartier}, {infra.commune}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-2 items-center">
                          <EditCustomer
                            id={infra.id}
                            nom={infra.nom}
                            prenom={infra.prenom}
                            sexe={infra.sexe}
                            avenue={infra.avenue}
                            quartier={infra.quartier}
                            commune={infra.commune}
                          />
                          <DeleteCustomer
                            id={infra.id}
                            nom={infra.nom}
                            setCustomerDeleted={setCustomerDeleted}
                          />
                          <Link href={`/dashboard/clients/${infra.id}`}>
                            <Eye className="h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="w-full text-center">
                    <p>il n'y a aucune infrastructure</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="hidden lg:flex justify-between items-center w-full px-6 py-8">
            <div className="text-sm font-medium text-gray-500">
              Page{" "}
              <span className="text-blue-600 font-bold">{currentPage}</span> sur{" "}
              {totalPages}
            </div>
            <div className="flex items-center gap-3 w-full max-w-xs">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-blue-200"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-blue-200"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Suivant <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
