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
import { useTypeInfradtructures } from "@/components/hooks/useTypeInfrastructure";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
const infrastructureSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  type_infrastructure: z.string().min(1, "Le type d'infrastructure est requis"),
  date_construction: z.string().min(1, "La date de construction est requise"),
  latitude: z.string().min(1, "La latitude est requise"),
  longitude: z.string().min(1, "La longitude est requise"),
  capacite: z.string().min(1, "La capacité est requise"),
  unite: z.string().min(1, "L'unité est requise"),
  zone: z.string().min(1, "Veuillez sélectionner une zone."),
  client: z.string().min(1, "Veuillez sélectionner un client."),
});

type InfrastructureFormData = z.infer<typeof infrastructureSchema>;

const CreateformInfrastructure = () => {
  // const [formData, setFormData] = useState<FormData>({
  //   nom: "",
  //   type_infrastructure: "",
  //   date_construction: "",
  //   latitude: "",
  //   longitude: "",
  //   capacite: "",
  //   unite: "",
  //   zone: "",
  //   client: "",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InfrastructureFormData>({
    resolver: zodResolver(infrastructureSchema),
    defaultValues: {
      nom: "",
      type_infrastructure: "",
      date_construction: "",
      latitude: "",
      longitude: "",
      capacite: "",
      unite: "",
      zone: "",
      client: "",
    },
  });

  const mutationCreateInfrastructure = useCreateInfrastructure();
  const { data: typeInfrastructure, isLoading } = useTypeInfradtructures();

  const onSubmit = async (data: InfrastructureFormData) => {
    // Handle form submission logic here
    const payload = {
      nom: data.nom,
      type_infrastructure: data.type_infrastructure,
      date_construction: data.date_construction,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      capacite: Number(data.capacite),
      unite: data.unite,
      zone: data.zone,
      client: data.client,
    };
    await mutationCreateInfrastructure.mutateAsync(payload);
  };
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Label htmlFor="nom"> Nom:</Label>
            <Input
              id="nom"
              type="text"
              placeholder="nom"
              {...register("nom")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="type_infrastructure_id">
              Type infrastructure :
            </Label>
            <select
              {...register("type_infrastructure")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selectionnez</option>
              {typeInfrastructure?.results.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="date_construction">date Construction:</Label>
            <Input
              id="date_construction"
              type="date_construction"
              placeholder="date_construction"
              {...register("date_construction")}
            />
            {errors.date_construction && <p>{errors.nom?.message}</p>}
          </div>
          <div>
            <Label htmlFor="latitude">Latitude : </Label>
            <Input
              id="latitude"
              type="latitude"
              placeholder="latitude"
              {...register("latitude")}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude : </Label>
            <Input
              id="longitude"
              type="longitude"
              placeholder="longitude"
              {...register("longitude")}
            />
          </div>
          <div>
            <Label htmlFor="capacite">Capacite : </Label>
            <Input
              id="capacite"
              type="capacite"
              placeholder="capacite"
              {...register("capacite")}
            />
          </div>
          <div>
            <Label htmlFor="unite">Unite (L): </Label>
            <Input
              id="unite"
              type="unite"
              {...register("unite")}
              placeholder="unite"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="zone_id">Zone : </Label>
            <select
              {...register("zone")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selectionnez</option>
              <option value="1">Zone</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="client_id">Client :</Label>
            <select
              {...register("client")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
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
