"use client";
import { Locale, useTranslations } from "@/lib/i18n";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Props = {};

const page = (props: Props) => {
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-blue-50 px-3 py-2 flex gap-4"
              >
                <PlusCircle /> Nouvelle infrastructure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80vw] md:max-w-[60vw] bg-white z-[9999] ">
              <DialogHeader>
                <DialogTitle>Ajouter une Nouvelle Infrastructure </DialogTitle>
                <DialogDescription>Voici les détails.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 overflow-y-auto max-h-[80vh]">
                <form>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="nom"> Nom:</Label>
                      <Input
                        id="nom"
                        type="text"
                        name="nom"
                        placeholder="nom"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="type_infrastructure_id">
                        Type infrastructure :
                      </Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Selectionnez</option>
                        <option value="1">Citerne</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="date_construction">
                        date Construction:
                      </Label>
                      <Input
                        id="date_construction"
                        type="date_construction"
                        name="date_construction"
                        placeholder="date_construction"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitude : </Label>
                      <Input
                        id="latitude"
                        type="latitude"
                        name="latitude"
                        placeholder="latitude"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude : </Label>
                      <Input
                        id="longitude"
                        type="longitude"
                        name="longitude"
                        placeholder="longitude"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacite">Capacite : </Label>
                      <Input
                        id="capacite"
                        type="capacite"
                        name="capacite"
                        placeholder="capacite"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unite">Unite (L): </Label>
                      <Input
                        id="unite"
                        type="unite"
                        name="unite"
                        placeholder="unite"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zone_id">Zone : </Label>
                      <Input
                        id="zone_id"
                        type="zone_id"
                        name="zone_id"
                        placeholder="zone_id"
                        //   onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_id">Proprietaire : </Label>
                      <Input
                        id="client_id"
                        type="client_id"
                        name="client_id"
                        placeholder="client_id"
                        //   onChange={handleChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      //   disabled={createDeliveryMutation.isPending}
                      className="w-full bg-orange-600 text-gray-200"
                    >
                      Ajouter Infrastructure
                    </Button>
                  </div>
                </form>
              </div>
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

export default page;
