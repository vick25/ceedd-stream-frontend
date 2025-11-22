import React, { useEffect, useState } from "react";
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
import {
  useCreateInfrastructure,
  useInfrastructures,
} from "@/components/hooks/useInfrastructure";
import { useTypeInfradtructures } from "@/components/hooks/useTypeInfrastructure";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCustomers,
  useCustomers,
} from "@/components/hooks/useCustomer";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
interface FormData {
  infrastructures: string;
  nom: string;
  superficie: string;
  etat_ravin: string;
  description: string;
  geom: string;
  shapefile_id: string;
}

interface ZoneFormClientProps {
  onFormSuccess: () => void;
}

const zoneSchema = z.object({
  infrastructures: z.string().min(1, "saisir un infrastructure"),
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  superficie: z.string().optional(),
  etat_ravin: z.string().optional(),
  description: z.string().optional(),
  geom: z.string().optional(),
  shapefile_id: z.string().optional(),
});

type ZoneFormData = z.infer<typeof zoneSchema>;

const CreateFormClient = ({ onFormSuccess }: ZoneFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      infrastructures: "",
      nom: "",
      superficie: "",
      etat_ravin: "",
      description: "",
      geom: "",
      shapefile_id: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateCustomers = useCreateCustomers();
  const { data: infrastructures, isLoading: infIsLoading } =
    useInfrastructures();

  // const {data:zonesData,isLoading:isZonesLoading}=useZone()

  const onSubmit = async (data: ZoneFormData) => {
    // Handle form submission logic here
    const payload = {
      infrastructures: data.infrastructures,
      nom: data.nom,
      superficie: data.superficie,
      etat_ravin: data.etat_ravin,
      description: data.description,
      geom: data.geom,
      shapefile_id: data.shapefile_id,
    };
    await mutationCreateCustomers.mutateAsync(payload);

    await queryClient.invalidateQueries({ queryKey: ["customers"] });
    onFormSuccess();
  };

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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <Label htmlFor="infrastructures">Infrastructures: </Label>

            <select
              id="infrastructures"
              {...register("infrastructures")}
              className={`flex h-10 w-full rounded-md border border-gray-200  border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.etat_ravin
                  ? "border border-red-500 "
                  : "border border-green-500"
              }`}
            >
              <option>Selectionnez:</option>
              {infrastructures?.results.map((infr: any) => (
                <option value={infr.id}>{infr.nom}</option>
              ))}
            </select>
            {errors.etat_ravin && (
              <p className="text-red-500 text-sm ">
                {errors.etat_ravin.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="nom"> Nom:</Label>
            <Input
              id="nom"
              type="text"
              placeholder="nom"
              {...register("nom")}
              className={`border border-white ${
                errors.nom
                  ? "border border-red-500"
                  : touchedFields.nom
                  ? "border border-green-600"
                  : "border border-gray-300"
              }`}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm">{errors.nom.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="superficie">superficie </Label>
            <Input
              id="superficie"
              type="text"
              placeholder="superficie"
              {...register("superficie")}
              className={`border border-gray-200 `}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="etat_ravin">etat_ravin </Label>

            <select
              id="etat_ravin"
              {...register("etat_ravin")}
              className={`flex h-10 w-full rounded-md border border-gray-200  border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.etat_ravin
                  ? "border border-red-500 "
                  : "border border-green-500"
              }`}
            >
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            {errors.etat_ravin && (
              <p className="text-red-500 text-sm ">
                {errors.etat_ravin.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">description : </Label>
            <Input
              id="description"
              type="description"
              placeholder="description"
              {...register("description")}
              className="border-gray-200  border"
            />
            {/* {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )} */}
          </div>
          <div>
            <Label htmlFor="geom">geom : </Label>
            <Input
              id="geom"
              type="text"
              placeholder="geom"
              {...register("geom")}
              className="border border-gray-200 "
            />
            {/* {errors.geom && (
              <p className="text-red-500 text-sm">{errors.geom.message}</p>
            )} */}
          </div>

          <div>
            <Label htmlFor="shapefile_id">shapefile_id : </Label>
            <Input
              id="shapefile_id"
              type="text"
              {...register("shapefile_id")}
              placeholder="shapefile_id"
              className="border border-gray-200 "
            />
            {errors.shapefile_id && (
              <p className="text-red-500 text-sm">
                {errors.shapefile_id.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            // disabled={mutationCreateCustomers.isPending}
            className="w-full bg-green-600 text-gray-200"
          >
            {mutationCreateCustomers.isPending
              ? "Chargement..."
              : " Ajouter Client"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormClient;
