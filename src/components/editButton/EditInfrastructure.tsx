import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconButton } from "@radix-ui/themes";
import { PencilLine } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InfrastructureTypes } from "@/types/infrastructure";
import { Button } from "../ui/button";

const EditInfrastructure = ({
  id,
  nom,
  type_infrastructure,
  date_construction,
  latitude,
  longitude,
  capacite,
  unite,
  zone,
  client,
}: InfrastructureTypes) => {
  const [formData, setFormData] = useState({
    nom: "",
    type_infrastructure: "",
    date_construction: "",
    latitude: "",
    longitude: "",
    capacite: "",
    unite: "",
    zone: "",
    client: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="orange"
          className="px-3 py-2 rounded-md border border-gray-200 text-gray-800"
        >
          <PencilLine size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white z-[9999]  ">
        <DialogTitle>Modifier l'infrastructure</DialogTitle>
        <div className="overflow-y-auto max-h-[80vh]">
          {" "}
          <form className="space-y-3 ">
            <div>
              <Label htmlFor="nom">Nom Infrastructure:</Label>
              <Input
                id="nom"
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="type_infrastructure">Type Infrastructure:</Label>
              <select
                name="type_infrastructure"
                value={formData.type_infrastructure}
                onChange={handleChange}
                id="type_infrastructure"
                className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selectionnez </option>
                <option value="">Citerne</option>
              </select>
            </div>
            <div>
              <Label htmlFor="date_construction">Date construction:</Label>
              <Input
                id="date_construction"
                name="date_construction"
                type="text"
                value={formData.date_construction}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude:</Label>
              <Input
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude:</Label>
              <Input
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacite">Capacite:</Label>
              <Input
                id="capacite"
                name="capacite"
                type="text"
                value={formData.capacite}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="unite">unite:</Label>
              <Input
                id="unite"
                name="unite"
                type="text"
                value={formData.unite}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zone">Zone contrubitive:</Label>
              <select
                name="zone"
                id="zone"
                value={formData.zone}
                className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selectionnez </option>
                <option value="">Citerne</option>
              </select>
            </div>
            <div>
              <Label htmlFor="client">Proprietaire:</Label>
              <select
                name="client"
                id="client"
                className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selectionnez </option>
                <option value="">Citerne</option>
              </select>
            </div>
            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-orange-600 text-gray-200"
              >
                Ajouter Infrastructure
              </Button>{" "}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfrastructure;
