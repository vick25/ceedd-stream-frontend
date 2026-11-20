import DeleteCustomer from "@/components/deleteButton/DeleteCustomer";
import EditCustomer from "@/components/editButton/EditCustomer";
import Loader from "@/components/Loader";
import { useAllCustomers } from "@/hooks/useCustomer";
import { CUSTOMERS_PAGE_SIZE } from "@/services/customer";
import { useAppStore } from "@/store/appStore";
import { Client } from "@/types/infrastructure";
import { ChevronLeft, ChevronRight, Eye, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../button";

interface ClientTableProps {
  // id du client qui vient d'être créé : la table revient en page 1 et le surligne
  createdClientId?: string | null;
}

export default function ClientTable({ createdClientId }: ClientTableProps) {
  // Recherche locale à la table (avant : partagée dans le store global avec la
  // page infrastructures, donc un texte tapé là-bas filtrait aussi les clients)
  const [searchTerms, setSearchTerms] = useState("");
  const [customerDelete, setCustomerDeleted] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const pageItems = CUSTOMERS_PAGE_SIZE;

  const term = searchTerms.toLowerCase().trim();
  const offset = (currentPage - 1) * pageItems;

  // On charge tous les clients (toutes les pages de l'API) puis on trie ici.
  // Ainsi l'ordre ne dépend pas du backend : on décide nous-mêmes que le
  // plus récent (plus grand id) passe en premier.
  const { data: allData, isPending } = useAllCustomers();

  // 1. Tri : du plus récent au plus ancien.
  //    [...] crée une copie : sort() modifie le tableau, et on ne doit jamais
  //    modifier directement les données du cache TanStack Query.
  const sortedCustomers = [...(allData?.results ?? [])].sort(
    (a: Client, b: Client) => Number(b.id) - Number(a.id),
  );

  // 2. Recherche sur nom / prénom (sur tous les clients, pas une seule page)
  const filtered =
    term === ""
      ? sortedCustomers
      : sortedCustomers.filter((custom: Client) => {
          // String(... ?? "") évite un crash si nom ou prénom est null en base
          const nom = String(custom.nom ?? "").toLowerCase();
          const prenom = String(custom.prenom ?? "").toLowerCase();
          return nom.includes(term) || prenom.includes(term);
        });

  // 3. Découpage en pages de 30
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageItems));
  const pageCustomers = filtered.slice(offset, offset + pageItems);

  const handleSearch = (value: string) => {
    setSearchTerms(value);
    setCurrentPage(1); // une nouvelle recherche repart de la page 1
  };

  // Après une création : le nouveau client a le plus grand id, il est donc
  // tout en haut de la page 1. On y revient et on vide la recherche.
  useEffect(() => {
    if (!createdClientId) return;
    setSearchTerms("");
    setCurrentPage(1);
  }, [createdClientId]);

  // Après une suppression, la dernière page peut disparaître : on recule
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const isCreated = (id: string | number) =>
    createdClientId != null && String(id) === String(createdClientId);

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
  if (isPending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="flex flex-col md:justify-between md:flex-row md:items-center  w-full  mb-6">
          <div className="relative w-full mb-4 md:w-wull  md:p-3">
            <input
              placeholder="Recherchez par nom ou prenom"
              name="searchTerms"
              value={searchTerms}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border p-4 rounded-xl"
            />
            {/* <Search className="absolute top-7 right-5 text-gray-500 cursor-pointer" /> */}
            <div className="absolute top-5 right-5 md:top-7 md:right-7 text-gray-500">
              {searchTerms ? (
                <X
                  className="h-5 w-5 cursor-pointer hover:text-red-500"
                  onClick={() => handleSearch("")}
                />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-col md:items-center gap-2">
            {/* <select
              name=""
              id=""
              className="flex border border-gray-300 h-10 w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selectionnez par Date</option>
            </select> */}
            {/* <div className="relative flex items-center">
                      <select
                        value={searchTypes}
                        onChange={(e) => setSearchTypes(e.target.value)}
                        className="border border-gray-300 h-10 w-full rounded-md bg-background px-3 py-2 text-sm pr-8"
                      >
                        <option value="">Tous les types</option>
                        {mutationTypeInfrastructure.data?.results.map((type: any) => (
                          <option key={type.id} value={type.nom}>
                            {type.nom}
                          </option>
                        ))}
                      </select>


                      {searchTypes && (
                        <X
                          className="absolute right-7 h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500"
                          onClick={() => setSearchTypes("")}
                        />
                      )}
                    </div> */}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden space-y-4 px-2">
            {pageCustomers.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                Aucun client trouvé
              </p>
            )}
            {pageCustomers.map((customer: any) => (
              <div
                key={customer.id}
                className={`relative w-full rounded-xl p-5 shadow-sm border ${
                  isCreated(customer.id)
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-100"
                }`}
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
                  disabled={currentPage >= totalPages}
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
                      className={`w-full border-b border-b-gray-300 py-3 text-sm last-of-type:border-none ${
                        isCreated(infra.id) ? "bg-green-50" : ""
                      }  [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg`}
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
                  <td colSpan={5} className="w-full text-center py-6">
                    <p>
                      Aucun client trouvé
                    </p>
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
                disabled={currentPage >= totalPages}
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
