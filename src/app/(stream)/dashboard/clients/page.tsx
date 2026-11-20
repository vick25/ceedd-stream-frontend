"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import CreateFormClient from "@/components/ui/clients/CreateFormClient";
import Table from "@/components/ui/clients/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Locale, useTranslations } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};

const ClientPage = (props: Props) => {
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [isClosed, setIsClosed] = useState(false);
  // id du dernier client créé, transmis à la table pour l'afficher et le surligner
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);

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

  return (
    <main className="container h-full min-h-0 flex flex-col gap-5 py-6 sm:py-8">
      <div className="flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Répertoire</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.navigation.dashboard}</h1>
          <p className="mt-1 text-sm text-slate-500">Consultez et gérez les clients enregistrés.</p>
        </div>
        <div className="flex gap-2">
          {/* <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button> */}
          <Dialog open={isClosed} onOpenChange={setIsClosed}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl border-blue-600 bg-blue-600 px-4 text-white shadow-sm shadow-blue-200 transition hover:border-blue-700 hover:bg-blue-700"
              >
                <PlusCircle />&nbsp;Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white z-9999 max-w-2xl md:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau client</DialogTitle>
                <DialogDescription>Renseigner les détails</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 overflow-y-auto max-h-[80vh]">
                <CreateFormClient
                  onFormSuccess={(createdClient) => {
                    setIsClosed(false);
                    if (createdClient?.id) {
                      setCreatedClientId(String(createdClient.id));
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
          {/* <button className="bg-blue-600 text-white px-3 py-2 rounded flex flex-row gap-4 items-center"></button> */}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="w-full min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-950/[0.02] sm:p-6">
        <div className="w-full">
          <Table createdClientId={createdClientId} />
        </div>
      </div>
    </main>
  );
};

export default ClientPage;
