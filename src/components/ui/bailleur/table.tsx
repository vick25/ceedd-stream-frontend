import DeleteBailleur from "@/components/deleteButton/DeleteBailleur";
import EditBailleur from "@/components/editButton/EditBailleur";
import Loader from "@/components/Loader";
import { useAllBailleurs } from "@/hooks/useBailleur";
import { usePagination } from "@/hooks/usePagination";
import { useAppStore } from "@/store/appStore";
import { Eye } from "lucide-react";
import { Locale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataPagination } from "../data-pagination";

export default function BailleurTable() {
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [bailleurDelete, setBailleurDelete] = useState<string>("");

  // initialize mutation
  // const { data: customers, isPending: customersIspending } = useCustomers();

  // tous les bailleurs (avant : seulement la 1re page de l'API)
  const { data: allResults = [], isPending: bailleurIspending } =
    useAllBailleurs();
  const {
    pageItems: pageBailleurs,
    paginationProps,
    topRef,
  } = usePagination(allResults);

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
  if (bailleurIspending) {
    return <Loader />;
  }
  return (
    <div ref={topRef} className="mt-6 flow-root scroll-mt-6">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* <div className="lg:hidden space-y-4 px-2">
          {pageBailleurs.map((zone: any) => {
            return (
              // <Link  href={`/dashboard/zones/${zone.id}`}>
              <div
                className="relative w-full rounded-xl bg-white p-5 shadow-sm border border-gray-100"
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
                    <DeleteBailleur
                      id={zone.id}
                      nom={zone.nom}
                      setBailleurDelete={setBailleurDelete}
                    />
                  </div>
                </div>
              </div>
              // </Link>
            );
          })}
        </div> */}
          <div className="lg:hidden space-y-4 px-2">
            {pageBailleurs.map((bailleur: any) => (
              <div
                key={bailleur.id}
                className="relative w-full rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Contenu de la Carte */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
                        Bailleur de fonds
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {bailleur.nom}
                      </h3>
                    </div>
                    {/* Badge pour le Sigle */}
                    <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        {bailleur.sigle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-400 italic">
                      Identifiant unique: #{bailleur.id.toString().slice(0, 5)}
                    </span>
                  </div>
                </div>

                {/* Barre d'actions (Séparée du contenu) */}
                <div className="flex items-center justify-end gap-3 px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                  {/* sur mobile aussi : accès à la fiche */}
                  <Link
                    href={`/dashboard/bailleurs/${bailleur.id}`}
                    aria-label={`Voir la fiche de ${bailleur.nom}`}
                    className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <EditBailleur
                    id={bailleur.id}
                    nom={bailleur.nom}
                    sigle={bailleur.sigle}
                  />
                  <DeleteBailleur
                    id={bailleur.id}
                    nom={bailleur.nom}
                    setBailleurDelete={setBailleurDelete}
                  />
                </div>
              </div>
            ))}

          </div>

          <table className="hidden min-w-full text-gray-900 lg:table">
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
              {pageBailleurs.length > 0 ? (
                pageBailleurs.map((zone: any) => {
                  return (
                    <tr
                      key={zone.id}
                      className="w-full border-b border-b-gray-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {zone.nom}
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
                          <DeleteBailleur
                            id={zone.id}
                            nom={zone.nom}
                            setBailleurDelete={setBailleurDelete}
                          />
                          <Link
                            href={`/dashboard/bailleurs/${zone.id}`}
                            aria-label={`Voir la fiche de ${zone.nom}`}
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
                  <td className="w-full text-center">
                    <p>Il n'y a aucun bailleur</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <DataPagination
            {...paginationProps}
            itemLabel={allResults.length > 1 ? "bailleurs" : "bailleur"}
          />

        </div>
      </div>
    </div>
  );
}
