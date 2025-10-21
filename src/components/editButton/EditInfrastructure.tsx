import React, { useEffect, useState } from "react";
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
import {
  useGetInfrastructure,
  useUpdateInfrastructure,
} from "../hooks/useInfrastructure";
import { useGetCustomer } from "../hooks/useCustomer";
import { useAllTypeInfrastructure } from "../hooks/useTypeInfrastructure";

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

  const updateMutationInfrastructure = useUpdateInfrastructure();
  const mutationInfrastructure = useGetInfrastructure();
  const mutationCustomer = useGetCustomer();
  const mutationTypeInfrastructure = useAllTypeInfrastructure();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const dataToSend = {
    //   ...formData,

    // };
    if (id) {
      await updateMutationInfrastructure.mutateAsync({ data: formData, id });
    }
  };
  useEffect(() => {
    mutationInfrastructure.mutate();
    mutationCustomer.mutate();
    mutationTypeInfrastructure.mutate();
  }, []);

  // useEffect(() => {
  //   if (
  //     mutationInfrastructure.data.results &&
  //     mutationCustomer.data.results &&
  //     mutationTypeInfrastructure.data.results
  //   ) {
  //   }
  // }, [
  //   mutationInfrastructure.mutate,
  //   mutationCustomer.mutate,
  //   mutationTypeInfrastructure.mutate,
  // ]);
  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        type_infrastructure,
        date_construction,
        latitude,
        longitude,
        capacite,
        unite,
        zone,
        client,
      });
    }
  }, [
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
  ]);

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
          <form className="space-y-3 " onSubmit={handleSubmit}>
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
                {mutationInfrastructure?.data?.results.length > 0 &&
                  mutationInfrastructure?.data?.results.map((type: any) => (
                    <option value={type.id}>{type.nom}</option>
                  ))}
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
