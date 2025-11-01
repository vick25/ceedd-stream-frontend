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
import {
  Client,
  InfrastructureTypes,
  // zone_contributive,
} from "@/types/infrastructure";
import { Button } from "../ui/button";
import {
  useGetInfrastructure,
  useUpdateInfrastructure,
} from "../hooks/useInfrastructure";
import { useCustomers, useGetCustomer } from "../hooks/useCustomer";
import { useTypeInfradtructures } from "../hooks/useTypeInfrastructure";
import { Skeleton } from "../ui/skeleton";

const EditInfrastructure = ({
  id,
  nom,
  type_infrastructure,
  date_construction,
  latitude,
  longitude,
  capacite,
  unite,
  // zone,
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
    client: "",
  });
  const [customers, setCustomers] = useState<Client[]>([]);
  // const [zones, setZones] = useState<zone_contributive[]>([]);

  const mutationInfrastructure = useGetInfrastructure();
  // const mutationCustomer = useGetCustomer();
  // const mutationTypeInfrastructure = useAllTypeInfrastructure();
  const updateMutationInfrastructure = useUpdateInfrastructure();

  const { data: CustomerData, isLoading } = useCustomers();
  const {
    data: typeInfrastructureData,
    isLoading: IsTypeInfrastructureLoading,
  } = useTypeInfradtructures();
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
  }, []);

  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        type_infrastructure: type_infrastructure.id,
        date_construction,
        latitude,
        longitude,
        capacite,
        unite,
        client: client.id,
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
              {IsTypeInfrastructureLoading ? (
                <Skeleton className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
              ) : (
                <select
                  name="type_infrastructure"
                  value={formData.type_infrastructure}
                  onChange={handleChange}
                  id="type_infrastructure"
                  className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selectionnez </option>
                  {typeInfrastructureData?.results.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.nom}
                    </option>
                  ))}
                </select>
              )}
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
            {/* <div>
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
            </div> */}
            <div>
              <Label htmlFor="client">Proprietaire:</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 " />
              ) : (
                <select
                  name="client"
                  id="client"
                  value={formData.client}
                  onChange={handleChange}
                  className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selectionnez </option>
                  {CustomerData?.results?.map((cust: any) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.nom}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateMutationInfrastructure.isPending}
              >
                {updateMutationInfrastructure.isPending
                  ? "Chargement ..."
                  : "Mettre à jour Infrastructure"}
              </Button>{" "}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfrastructure;
