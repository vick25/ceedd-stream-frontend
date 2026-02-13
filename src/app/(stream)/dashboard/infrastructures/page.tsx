"use client";

import { Locale, useTranslations } from "@/lib/i18n";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/infrastructure/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateformInfrastructure from "@/components/ui/infrastructure/CreateformInfrastructure";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import SearchInputWithAutocomplete from "@/components/SearchInputWithAutocomplete";
import SearchResultsList from "@/components/SearchResultsList";

type Props = {};

const page = (props: Props) => {
  const { user, _hasHydrated, isAuthenticated, searchResults, searchTerms } =
    useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [isOpen, setIsOpen] = useState(false);

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

  const isSearching = searchTerms && searchTerms.length > 0;
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-blue-50 px-3 py-2 flex gap-4 border border-gray-300"
              >
                <PlusCircle /> Nouvelle infrastructure
              </Button>
            </DialogTrigger>
            <DialogContent className=" bg-white z-9999 max-w-2xl md:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Infrastructure </DialogTitle>
                <DialogDescription>Voici les détails.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4  overflow-y-auto max-h-[70vh]">
                <CreateformInfrastructure open={isOpen} setOpen={setIsOpen} />
              </div>
            </DialogContent>
          </Dialog>
          {/* <button className="bg-blue-600 text-white px-3 py-2 rounded flex flex-row gap-4 items-center"></button> */}
        </div>
      </div>
      <div>{/* <SearchInputWithAutocomplete /> */}</div>
      {/* KPI Cards */}
      <div className="w-full bg-white rounded-lg shadow-xl p-6">
        <Table />
      </div>
    </main>
  );
};

export default page;
