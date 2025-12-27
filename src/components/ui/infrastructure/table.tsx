import DeleteInfrastructure from "@/components/deleteButton/DeleteInfrastructure";
import EditInfrastructure from "@/components/editButton/EditInfrastructure";
import { useCustomer, useGetCustomer } from "@/components/hooks/useCustomer";
import { useGetInfrastructure } from "@/components/hooks/useInfrastructure";
import {
  useAllTypeInfrastructure,
  useTypeInfrastructure,
} from "@/components/hooks/useTypeInfrastructure";

import { useZoneContributive } from "@/components/hooks/useZoneContributive";
import Loader from "@/components/Loader";
import { InfrastructureTypes } from "@/types/infrastructure";
import { useEffect, useState } from "react";
import { tr } from "zod/v4/locales";
import { Skeleton } from "../skeleton";
import Link from "next/link";
import { Eye } from "lucide-react";
// import InfrastructureDetails from "@/components/shows/InfrastructuresDetails";

export default function InfrastructureTable() {
  const [getInfastructure, setGetInfrastructure] = useState<
    InfrastructureTypes[]
  >([]);

  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeInfras, setTypeInfras] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [infrastructureDeleted, setInfrastructureDeleted] =
    useState<string>("");

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

  if (mutationInfranstructure.isPending) {
    return <Loader />;
  }

  console.log({ getInfastructure });
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {getInfastructure?.map((infrastructure: any) => {
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
          </div>

          <table className="hidden  min-w-full text-gray-900  lg:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Proprietaire
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
                  Capacite{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  unite
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
              {getInfastructure.length > 0 ? (
                getInfastructure?.map((infra) => {
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
                        {" "}
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
        </div>
      </div>
    </div>
  );
}
