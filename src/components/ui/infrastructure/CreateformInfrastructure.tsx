import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useCreateInfrastructure } from "@/components/hooks/useInfrastructure";

interface FormData {
  nom: string;
  type_infrastructure: string;
  date_construction: string;
  latitude: string;
  longitude: string;
  capacite: string;
  unite: string;
  zone: string;
  client: string;
}
const CreateformInfrastructure = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const mutationCreateInfrastructure = useCreateInfrastructure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const payload = {
      nom: formData.nom,
      type_infrastructure: formData.type_infrastructure,
      date_construction: formData.date_construction,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      capacite: Number(formData.capacite),
      unite: formData.unite,
      zone: formData.zone,
      client: formData.client,
    };
    await mutationCreateInfrastructure.mutateAsync(payload);
  };
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
    <div>
      <form>
        <div className="space-y-2">
          <div>
            <Label htmlFor="nom"> Nom:</Label>
            <Input
              id="nom"
              type="text"
              name="nom"
              placeholder="nom"
              onChange={handleChange}
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
            <Label htmlFor="date_construction">date Construction:</Label>
            <Input
              id="date_construction"
              type="date_construction"
              name="date_construction"
              placeholder="date_construction"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="latitude">Latitude : </Label>
            <Input
              id="latitude"
              type="latitude"
              name="latitude"
              placeholder="latitude"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude : </Label>
            <Input
              id="longitude"
              type="longitude"
              name="longitude"
              placeholder="longitude"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="capacite">Capacite : </Label>
            <Input
              id="capacite"
              type="capacite"
              name="capacite"
              placeholder="capacite"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="unite">Unite (L): </Label>
            <Input
              id="unite"
              type="unite"
              name="unite"
              placeholder="unite"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="zone_id">Zone : </Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Selectionnez</option>
              <option value="1">Zone</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="client_id">Type infrastructure :</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Selectionnez</option>
              <option value="1">Test</option>
            </select>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={mutationCreateInfrastructure.isPending}
            className="w-full bg-orange-600 text-gray-200"
          >
            {mutationCreateInfrastructure.isPending
              ? "Chargement..."
              : " Ajouter Infrastructure"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateformInfrastructure;
