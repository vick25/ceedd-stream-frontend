import DeleteInfrastructure from "@/components/deleteButton/DeleteInfrastructure";
import EditInfrastructure from "@/components/editButton/EditInfrastructure";
import { useGetCustomer } from "@/hooks/useCustomer";
import { useGetInfrastructure } from "@/hooks/useInfrastructure";
import { useAllTypeInfrastructure } from "@/hooks/useTypeInfrastructure";

import { useZoneContributive } from "@/hooks/useZoneContributive";
import Loader from "@/components/Loader";
import { InfrastructureTypes } from "@/types/infrastructure";

import { useAppStore } from "@/store/appStore";
import { ChevronLeft, ChevronRight, Eye, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../button";
// import InfrastructureDetails from "@/components/shows/InfrastructuresDetails";

export default function InfrastructureTable() {
  const { searchTerms, setSearchTerms, searchTypes, setSearchTypes } =
    useAppStore();
  const [getInfrastructure, setGetInfrastructure] = useState<
    InfrastructureTypes[]
  >([]);

  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeInfras, setTypeInfras] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [infrastructureDeleted, setInfrastructureDeleted] =
    useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerms, setSearchTerms] = useState("");
  const pageItems = 20;

  // initialize mutation
  const mutationInfrastructure = useGetInfrastructure();
  const mutationCustomer = useGetCustomer();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();
  const mutationZone = useZoneContributive();

  //useEffect
  useEffect(() => {
    // mutationInfrastructure.mutate();
    mutationCustomer.mutate();
    mutationTypeInfrastructure.mutate();
  }, [
    // mutationInfrastructure.mutate,
    mutationCustomer.mutate,
    mutationTypeInfrastructure.mutate,
  ]);

  useEffect(() => {
    if (
      mutationInfrastructure.data &&
      mutationInfrastructure.data.results.length > 0
    ) {
      const convertInfrastructure = mutationInfrastructure.data.results;
      setGetInfrastructure(convertInfrastructure);
    }
  }, [mutationInfrastructure.data]);

  const filterData = getInfrastructure.filter((infra) => {
    // 1. On prépare les termes (minuscules et sans espaces inutiles)
    const term = searchTerms?.toLowerCase().trim() || "";
    const typeFilter = searchTypes || "";

    // 2. Vérification du texte (Nom infrastructure ou Nom client)
    // Si term est vide, on valide par défaut (true)
    const matchSearchTerms =
      term === "" ||
      infra.nom?.toLowerCase().includes(term) ||
      infra.client?.nom?.toLowerCase().includes(term);

    // 3. Vérification du Type (Select)
    // Si typeFilter est vide, on valide par défaut (true)
    const matchSelectType =
      typeFilter === "" || infra.type_infrastructure?.nom === typeFilter;

    // L'infrastructure doit remplir les DEUX conditions
    return matchSearchTerms && matchSelectType;
  });
  const totalPages = Math.ceil(filterData.length / pageItems);
  const startIndex = (currentPage - 1) * pageItems;
  const pageInfrastructures = filterData.slice(
    startIndex,
    startIndex + pageItems,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerms]);

  if (mutationInfrastructure.isPending) {
    return <Loader />;
  }

  // console.log({ getInfrastructure });
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="flex flex-col md:justify-between md:flex-row md:items-center  w-full  mb-6">
          <div className="relative w-full mb-4 md:w-1/2  md:p-3">
            <input
              placeholder="recherche par nom ou par nom du propriétaire"
              name="searchTerms"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="w-full border p-4 rounded-xl"
            />
            {/* <Search className="absolute top-7 right-5 text-gray-500 cursor-pointer" /> */}
            <div className="absolute top-5 right-5 md:top-7 md:right-7 text-gray-500">
              {searchTerms ? (
                <X
                  className="h-5 w-5 cursor-pointer hover:text-red-500"
                  onClick={() => setSearchTerms("")}
                />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-col  md:items-center gap-2">
            {/*<select
              name=""
              id=""
              className="flex border border-gray-300 h-10 w-full rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selectionnez par Date</option>
            </select>*/}
            <div className="relative flex items-center">
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

              {/* Si searchTypes n'est pas vide, on affiche la croix */}
              {searchTypes && (
                <X
                  className="absolute right-7 h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500"
                  onClick={() => setSearchTypes("")}
                />
              )}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden space-y-4 px-2">
            {pageInfrastructures?.map((infra: any) => (
              <div
                key={infra.id}
                className="relative w-full rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Zone cliquable pour voir les détails */}
                <Link
                  href={`/dashboard/infrastructures/${infra.id}`}
                  className="block p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
                        Infrastructure
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {infra.nom}
                      </h3>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">
                        Capacité
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {infra.capacite}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          {infra.unite}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">
                        Propriétaire
                      </p>
                      <p className="text-sm font-semibold text-gray-700 truncate">
                        {infra?.client?.nom || "Non assigné"}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Barre d'actions (Séparée du Link) */}
                <div className="flex items-center justify-end gap-3 px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                  <EditInfrastructure
                    id={infra.id}
                    nom={infra.nom}
                    type_infrastructure={infra.type_infrastructure}
                    date_construction={infra.date_construction}
                    latitude={infra.latitude}
                    longitude={infra.longitude}
                    capacite={infra.capacite}
                    unite={infra.unite}
                    client={infra.client}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  />
                  <DeleteInfrastructure
                    id={infra.id}
                    nom={infra.nom}
                    setInfrastructureDeleted={setInfrastructureDeleted}
                  />
                </div>
              </div>
            ))}

            {/* Pagination Mobile Améliorée */}
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-sm font-medium text-gray-500">
                Page{" "}
                <span className="text-blue-600 font-bold">{currentPage}</span>{" "}
                sur {totalPages}
              </div>
              <div className="flex items-center gap-3 w-full max-w-xs">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-blue-200"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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

          <table className="hidden  min-w-full text-gray-900  lg:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Propriétaire
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type Infrastructure
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Latitude
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Longitude
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Capacité
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unité
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Zone
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageInfrastructures.length > 0 ? (
                pageInfrastructures?.map((infra) => {
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
                        {/* {infra?.client?.nom} */}
                        {infra.client?.nom || "Aucun propriétaire"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.type_infrastructure?.nom || "aucun "}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.latitude}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.longitude}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.capacite}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {infra.unite}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3"></td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3 items-center">
                          <EditInfrastructure
                            id={infra.id}
                            nom={infra.nom}
                            type_infrastructure={infra.type_infrastructure}
                            date_construction={infra.date_construction}
                            latitude={infra.latitude}
                            longitude={infra.longitude}
                            capacite={infra.capacite}
                            unite={infra.unite}
                            // zone={infra.zone}
                            client={infra.client}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                          />
                          <DeleteInfrastructure
                            id={infra.id}
                            nom={infra.nom}
                            setInfrastructureDeleted={setInfrastructureDeleted}
                          />
                          <Link href={`/dashboard/shows/${infra.id}`}>
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
          {/* <div className="hidden lg:flex justify-between items-center w-full px-6 py-4">
            <div>
              Page {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                className="cursor-pointer border border-blue-300 hover:bg-blue-300 hover:text-white"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="cursor-pointer border border-blue-300 hover:bg-blue-300 hover:text-white"
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div> */}
          {/* Pagination Mobile Améliorée */}
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
