import DeleteInfrastructure from "@/components/deleteButton/DeleteInfrastructure";
import {
  useCustomers
} from "@/components/hooks/useCustomer";

import EditCustomer from "@/components/editButton/EditCustomer";
import Loader from "@/components/Loader";
import { Client } from "@/types/infrastructure";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClientTable() {
  const [getClients, setGetClients] = useState<Client[]>([]);

  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [typeInfras, setTypeInfras] = useState<Record<string, string>>({});
  const [zones, setZones] = useState<Record<string, string>>({});
  const [infrastructureDeleted, setInfrastructureDeleted] =
    useState<string>("");

  // initialize mutation
  const { data: customers, isPending: customersIspending } = useCustomers();
  //   const mutationInfranstructure = useGetInfrastructure();
  //   const mutationCustomer = useGetCustomer();
  //   const mutationTypeInfrastructure = useAllTypeInfrastructure();
  //   const mutationZone = useZoneContributive();

  //useEffect

  if (customersIspending) {
    return <Loader />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="lg:hidden">
            {customers?.results.map((customer: any) => {
              return (
                <Link
                  key={customer.id}
                  href={`/dashboard/infrastructures/${customer.id}`}
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
                            <span className="font-semibold">Noms</span>
                            <p>{customer.nom}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="font-semibold">Prénom</span>
                            <p>{customer.prenom}</p>
                          </div>
                        </div>
                        {/* <p className="text-sm text-gray-500"></p> */}
                      </div>
                      {/* <InvoiceStatus status={invoice.status} /> */}
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          Adresse : {customer.avenue},{customer.quartier},
                          {customer.commune}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <EditCustomer
                          id={customer.id}
                          nom={customer.nom}
                          prenom={customer.prenom}
                          sexe={customer.sexe}
                          avenue={customer.avenue}
                          quartier={customer.quartier}
                          commune={customer.commune}
                        />
                        <DeleteInfrastructure
                          id={customer.id}
                          nom={customer.nom}
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
              {customers.results.length > 0 ? (
                customers?.results.map((infra: any) => {
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
                        <div className="flex justify-end gap-3 items-center">
                          <EditCustomer
                            id={infra.id}
                            nom={infra.nom}
                            prenom={infra.prenom}
                            sexe={infra.sexe}
                            avenue={infra.avenue}
                            quartier={infra.quartier}
                            commune={infra.commune}
                          />
                          <DeleteInfrastructure
                            id={infra.id}
                            nom={infra.nom}
                            setInfrastructureDeleted={setInfrastructureDeleted}
                          />
                          <Link href={`/dashboard/infrastructures/${infra.id}`}>
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
