import DeleteInfrastructure from "@/components/deleteButton/deleteInfrastructure";
import EditInfrastructure from "@/components/editButton/EditInfrastructure";
import { useGetInfrastructure } from "@/components/hooks/useInfrastructure";
import Loader from "@/components/Loader";
import { InfrastructureTypes } from "@/types/infrastructure";
import { useEffect, useState } from "react";
import { tr } from "zod/v4/locales";

export default function InfrastructureTable() {
  const [getInfastructure, setGetInfrastructure] = useState<
    InfrastructureTypes[]
  >([]);
  const mutationInfranstructure = useGetInfrastructure();

  useEffect(() => {
    mutationInfranstructure.mutate();
  }, []);

  useEffect(() => {
    if (mutationInfranstructure.data) {
      setGetInfrastructure(mutationInfranstructure.data.results);
      console.log(getInfastructure);
    }
  }, [mutationInfranstructure.data]);

  if (mutationInfranstructure.isPending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {getInfastructure?.map((infrastructure: any) => (
              <div
                key={infrastructure.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {/* <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                      {/* <p>{invoice.name}</p> */}
                      <p>{infrastructure.nom}</p>
                    </div>
                    <p className="text-sm text-gray-500"></p>
                  </div>
                  {/* <InvoiceStatus status={invoice.status} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {/* {formatCurrency(invoice.amount)} */}
                    </p>
                    {/* <p>{formatDateToLocal(invoice.date)}</p> */}
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={invoice.id} /> */}
                    {/* <DeleteInvoice id={invoice.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden  min-w-full text-gray-900 md:table">
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
                  unite
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Zone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Longitude
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {getInfastructure.length > 0 ? (
                getInfastructure?.map((infra) => (
                  <tr
                    key={infra.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
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
                    <td className="whitespace-nowrap px-3 py-3"></td>
                    <td className="whitespace-nowrap px-3 py-3"></td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {" "}
                      {infra.latitude}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3"></td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {/* <InvoiceStatus status={invoice.status} /> */}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {infra.longitude}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <EditInfrastructure id={infra.id} />
                        <DeleteInfrastructure id={infra.id} nom={infra.nom} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
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
