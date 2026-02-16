"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateFormInspections from "@/components/ui/inspections/CreateFormInspections";
import Table from "@/components/ui/inspections/table";
import { Locale, useTranslations } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};

const InspectionPage = (props: Props) => {
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [isClosed, setIsClosed] = useState(false);

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
    <main className="container py-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.navigation.dashboard}</h1>
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
                className="hover:bg-blue-50 px-3 py-2 flex gap-4 border border-gray-300"
              >
                <PlusCircle />Nouvelle inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white z-9999 max-w-2xl md:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle inspection</DialogTitle>
                <DialogDescription>Renseigner les détails.</DialogDescription>
              </DialogHeader>
              {/* <div className="space-y-4 py-4 overflow-y-auto max-h-[80vh]"> */}
              <CreateFormInspections onFormSuccess={() => setIsClosed(false)} />
              {/* </div> */}
            </DialogContent>
          </Dialog>
          {/* <button className="bg-blue-600 text-white px-3 py-2 rounded flex flex-row gap-4 items-center"></button> */}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="w-full bg-white rounded-lg shadow-xl p-6">
        <Table />
      </div>
    </main>
  );
};

export default InspectionPage;
