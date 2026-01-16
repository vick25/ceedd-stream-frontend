import DeleteInfrastructure from "@/components/deleteButton/DeleteInfrastructure";
import EditInfrastructure from "@/components/editButton/EditInfrastructure";
import { useGetCustomer } from "@/components/hooks/useCustomer";
import { useGetInfrastructure } from "@/components/hooks/useInfrastructure";
import { useAllTypeInfrastructure } from "@/components/hooks/useTypeInfrastructure";

import { useZoneContributive } from "@/components/hooks/useZoneContributive";
import Loader from "@/components/Loader";
import { InfrastructureTypes } from "@/types/infrastructure";

import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../button";
// import InfrastructureDetails from "@/components/shows/InfrastructuresDetails";

export default function InfrastructureTable() {
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
  const pageItems = 20;
  // initialize mutation

  const mutationInfranstructure = useGetInfrastructure();
  const mutationCustomer = useGetCustomer();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();
  const mutationZone = useZoneContributive();

  //useEffect

  useEffect(() => {
    mutationInfranstructure.mutate();
    mutationCustomer.mutate();
    mutationTypeInfrastructure.mutate();
  }, [
    mutationInfranstructure.mutate,
    mutationCustomer.mutate,
    mutationTypeInfrastructure.mutate,
  ]);

  useEffect(() => {
    if (
      mutationInfranstructure.data &&
      mutationInfranstructure.data.results.length > 0
    ) {
      const convertInfrastructure = mutationInfranstructure.data.results;
      setGetInfrastructure(convertInfrastructure);
    }
  }, [mutationInfranstructure.data]);

  const totalPages = Math.ceil(getInfrastructure.length / pageItems);
  const startIndex = (currentPage - 1) * pageItems;
  const pageInfrastructures = getInfrastructure.slice(
    startIndex,
    startIndex + pageItems
  );

  if (mutationInfranstructure.isPending) {
    return <Loader />;
  }

  // console.log({ getInfrastructure });
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {pageInfrastructures?.map((infrastructure: any) => {
              return (
                <Link
                  key={infrastructure.id}
                  href={`/dashboard/infrastructures/${infrastructure.id}`}
                >
                  <div className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          {/* <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                          {/* <p>{invoice.name}</p> */}
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold">Nom</span>
                            <p>{infrastructure.nom}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold">Capacité</span>
                            <p>{infrastructure.capacite}</p>
                          </div>
                        </div>
                        {/* <p className="text-sm text-gray-500"></p> */}
                      </div>
                      {/* <InvoiceStatus status={invoice.status} /> */}
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          {/* Propriétaire : {infrastructure?.client?.nom} */}
                          {infrastructure?.client?.nom || "Aucun propriétaire"}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <EditInfrastructure
                          id={infrastructure.id}
                          nom={infrastructure.nom}
                          type_infrastructure={
                            infrastructure.type_infrastructure
                          }
                          date_construction={infrastructure.date_construction}
                          latitude={infrastructure.latitude}
                          longitude={infrastructure.longitude}
                          capacite={infrastructure.capacite}
                          unite={infrastructure.unite}
                          // zone={infrastructure.zone}
                          client={infrastructure.client}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                        />
                        <DeleteInfrastructure
                          id={infrastructure.id}
                          nom={infrastructure.nom}
                          setInfrastructureDeleted={setInfrastructureDeleted}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            <div className="flex justify-between items-center">
              <div>
                Page {currentPage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
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
          <div className="flex justify-between items-center w-full px-6 py-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
