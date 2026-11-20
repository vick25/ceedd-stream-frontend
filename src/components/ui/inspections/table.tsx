import Loader from "@/components/Loader";
import DeleteInspection from "@/components/deleteButton/DeleteInspection";
import EditInspection from "@/components/editButton/EditInspection";
import { useAllInspections } from "@/hooks/useInspection";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "../data-pagination";
import { displayDate } from "@/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InspectionTable() {
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeinsps, setTypeinsps] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [inspstructureDeleted, setInspectionDeleted] = useState<string>("");

  // initialize mutation
  // Toutes les inspections, la plus récente d'abord. Avant : seulement la
  // 1re page de l'API, sans aucune pagination.
  const { data: allInspections = [], isPending: inspectionsIspending } =
    useAllInspections();
  const sortedInspections = [...allInspections].sort(
    (a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const {
    pageItems: pageInspections,
    paginationProps,
    topRef,
  } = usePagination(sortedInspections);
  //   const mutationinspnstructure = useGetinspstructure();
  //   const mutationCustomer = useGetCustomer();
  //   const mutationTypeinspstructure = useAllTypeinspstructure();
  //   const mutationZone = useZoneContributive();

  if (inspectionsIspending) {
    return <Loader />;
  }

  return (
    <div ref={topRef} className="mt-6 flow-root scroll-mt-6">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {pageInspections.map((customer: any) => {
              return (
                // <Link
                //   key={customer.id}
                //   href={`/dashboard/inspstructures/${customer.id}`}
                // >
                <div
                  key={customer.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Date</span>
                          <p>{displayDate(customer.date)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Etat</span>
                          <p>{customer.etat}</p>
                        </div>
                      </div>
                      {/* <p className="text-sm text-gray-500"></p> */}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        Inspecteur : {customer.inspecteur}
                      </p>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                      <EditInspection
                        id={customer.id}
                        date={customer.date}
                        etat={customer.etat}
                        inspecteur={customer.inspecteur}
                        commentaire={customer.commentaire}
                        prochain_controle={customer.prochain_controle}
                        infrastructure={customer.infrastructure.nom}
                      />
                      <DeleteInspection
                        id={customer.id}
                        inspecteur={customer.inspecteur}
                        setInspectionDeleted={setInspectionDeleted}
                      />
                      {/* la page /dashboard/inspstructures n'existe pas : l'œil ouvre la
                          fiche de l'infrastructure, qui liste ses inspections */}
                      <Link
                        href={`/dashboard/shows/${customer?.infrastructure?.id ?? customer?.infrastructure}`}
                        aria-label="Voir l'infrastructure inspectée"
                      >
                        <Eye className="h-4" />
                      </Link>
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
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Etat
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Inspecteur
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Commentaire
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Prochain controle
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Infastructure
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageInspections.length > 0 ? (
                pageInspections.map((insp: any) => {
                  //jointure

                  // const zone = zones[insp?.zone?.toString()];
                  return (
                    <tr
                      key={insp.id}
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
                          {displayDate(insp.date)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {insp.etat}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {insp.inspecteur}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {insp.commentaire}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {displayDate(insp.prochain_controle)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {insp.infrastructure?.nom}{" "}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3 items-center">
                          <EditInspection
                            id={insp.id}
                            date={insp.date}
                            etat={insp.etat}
                            inspecteur={insp.inspecteur}
                            commentaire={insp.commentaire}
                            prochain_controle={insp.prochain_controle}
                            infrastructure={insp.infrastructure.nom}
                          />
                          <DeleteInspection
                            id={insp.id}
                            inspecteur={insp.inspecteur}
                            setInspectionDeleted={setInspectionDeleted}
                          />
                          <Link
                            href={`/dashboard/shows/${insp.infrastructure?.id ?? insp.infrastructure}`}
                            aria-label="Voir l'infrastructure inspectée"
                          >
                            <Eye className="h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="w-full text-center py-6">
                    <p>Aucune inspection enregistrée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <DataPagination
            {...paginationProps}
            itemLabel={sortedInspections.length > 1 ? "inspections" : "inspection"}
          />
        </div>
      </div>
    </div>
  );
}
