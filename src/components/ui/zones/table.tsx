import DeleteZoneContributide from "@/components/deleteButton/DeleteZoneContributide";
import EditZoneContributide from "@/components/editButton/EditZoneContributide";
import { useZoneContributives } from "@/hooks/useZoneContributive";
import Loader from "@/components/Loader";
import { Zone_contributive } from "@/types/infrastructure";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ZoneTable() {
  const [getZones, setGetZones] = useState<Zone_contributive[]>([]);

  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeInfras, setTypeInfras] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [zoneContributide, setZoneContributide] = useState<string>("");

  // initialize mutation
  // const { data: customers, isPending: customersIspending } = useCustomers();

  const { data: zonesData, isPending: zoneIspending } = useZoneContributives();

  //useEffect

  if (zoneIspending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {zonesData?.results.map((zone: any) => {
              return (
                <Link key={zone.id} href={`/dashboard/zones/${zone.id}`}>
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
                            <p>{zone.nom}</p>
                          </div>
                        </div>
                        {/* <p className="text-sm text-gray-500"></p> */}
                      </div>
                      {/* <InvoiceStatus status={invoice.status} /> */}
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          Etat du ravin : {zone.etat_ravin}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <EditZoneContributide
                          id={zone.id}
                          nom={zone.nom}
                          etat_ravin={zone.etat_ravin}
                          description={zone.description}
                          shapefile_id={zone.shapefile_id}
                        />
                        <DeleteZoneContributide
                          id={zone.id}
                          nom={zone.nom}
                          setZoneContributide={setZoneContributide}
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
                  Etat du ravin
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Lié au shapefile
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {zonesData?.results.length > 0 ? (
                zonesData?.results.map((zone: any) => {
                  //jointure

                  // const zone = zones[infra?.zone?.toString()];
                  return (
                    <tr
                      key={zone.id}
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
                          {zone.nom}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">
                        {zone.etat_ravin}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {" "}
                        {zone.description}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">
                        {" "}
                        {zone.shapefile_id}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3 items-center">
                          <EditZoneContributide
                            id={zone.id}
                            nom={zone.nom}
                            etat_ravin={zone.etat_ravin}
                            description={zone.description}
                            shapefile_id={zone.shapefile_id}
                          />
                          <DeleteZoneContributide
                            id={zone.id}
                            nom={zone.nom}
                            setZoneContributide={setZoneContributide}
                          />
                          <Link href={`/dashboard/infrastructures/${zone.id}`}>
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
