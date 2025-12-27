
import EditBailleur from "@/components/editButton/EditBailleur";
import { useBailleurs } from "@/components/hooks/useBailleur";
import Loader from "@/components/Loader";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BailleurTable() {
  const [zoneContributide, setBailleur] = useState<string>("");

  // initialize mutation
  // const { data: customers, isPending: customersIspending } = useCustomers();

  const { data: bailleurs, isPending: bailleurIspending } = useBailleurs();

  //useEffect

  if (bailleurIspending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {bailleurs?.results.map((zone: any) => {
              return (
                // <Link  href={`/dashboard/zones/${zone.id}`}>
                <div
                  className="mb-2 w-full rounded-md bg-white p-4"
                  key={zone.id}
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Nom</span>
                          <p>{zone.nom}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Sigle</span>
                          <p>{zone.sigle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex justify-end gap-2">
                      <EditBailleur
                        id={zone.id}
                        nom={zone.nom}
                        sigle={zone.sigle}
                      />
                      {/* <DeleteZoneContributide
                          id={zone.id}
                          nom={zone.nom}
                          setBailleur={setBailleur}
                        /> */}
                    </div>
                  </div>
                </div>
                // </Link>
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
                  Sigle
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bailleurs?.results?.length > 0 ? (
                bailleurs?.results?.map((zone: any) => {
                  return (
                    <tr
                      key={zone.id}
                      className="w-full border-b border-b-gray-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {zone.nom}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {zone.sigle}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3 items-center">
                          <EditBailleur
                            id={zone.id}
                            nom={zone.nom}
                            sigle={zone.sigle}
                          />
                          {/* <DeleteBailleur
                            id={zone.id}
                            nom={zone.nom}
                            setBailleur={setBailleur}
                          /> */}
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
