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
import { inspection } from "@/types/infrastructure";
import { useCreateInspection } from "@/components/hooks/useInspection";
interface FormData {
  date: string;
  etat: string;
  inspecteur: string;
  commentaire: string;
  prochain_controle: string;
  infrastructure: string;
}

interface CreateFormInspectionsProps {
  onFormSuccess: () => void;
}

const inspectionSchema = z.object({
  date: z.string().min(3, "Le date doit contenir au moins 3 caractères"),
  etat: z
    .string()
    .refine((val) => Object.values(inspection).includes(val as inspection), {
      message: "Veuillez sélectionner un état valide.",
    }),
  inspecteur: z.string().optional(),
  commentaire: z.string().min(1, "Le commentaire est requis").optional(),
  prochain_controle: z.string().optional(),
  infrastructure: z.string().min(1, "La capacité est requise").optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

const CreateFormInspections = ({
  onFormSuccess,
}: CreateFormInspectionsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      date: "",
      etat: "",
      inspecteur: "",
      commentaire: "",
      prochain_controle: "",
      infrastructure: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const inspections = Object.values(inspection);
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateInspection = useCreateInspection();

  const { data: infrastructureData, isLoading: isInfrastructureLoading } =
    useInfrastructures();
  const onSubmit = async (data: InspectionFormData) => {
    // Handle form submission logic here
    const payload = {
      date: data.date,
      etat: data.etat,
      inspecteur: data.inspecteur,
      commentaire: data.commentaire,
      prochain_controle: data.prochain_controle,
      infrastructure: data.infrastructure,
    };
    await mutationCreateInspection.mutateAsync(payload);

    await queryClient.invalidateQueries({ queryKey: ["inspections"] });
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="date"> date:</Label>
            <Input
              id="date"
              type="date"
              placeholder="date"
              {...register("date")}
              className={`border border-white`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="etat">etat </Label>
            <select
              id="etat"
              {...register("etat")}
              className={`flex h-10 w-full rounded-md border border-gray-200  border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 `}
            >
              {inspections.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.commentaire && (
              <p className="text-red-500 text-sm ">
                {errors.commentaire.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="inspecteur">inspecteur:</Label>
            <Input
              id="inspecteur"
              type="inspecteur"
              placeholder="inspecteur"
              {...register("inspecteur")}
            />
            {/* {errors.inspecteur && <p>{errors.inspecteur?.message}</p>} */}
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="commentaire">commentaire </Label>
            <textarea
              id="commentaire"
              placeholder="commentaire"
              {...register("commentaire")}
              className={`border border-gray-200 `}
            ></textarea>
          </div>
          <div>
            <Label htmlFor="prochain_controle">Prochain controle : </Label>
            <Input
              id="prochain_controle"
              type="date"
              placeholder="prochain_controle"
              {...register("prochain_controle")}
              className="border-gray-200  border"
            />
            {/* {errors.prochain_controle && (
              <p className="text-red-500 text-sm">{errors.prochain_controle.message}</p>
            )} */}
          </div>
          <div>
            <Label htmlFor="infrastructure">infrastructure : </Label>
            <select
              id="infrastructure"
              {...register("infrastructure")}
              className={`flex h-10 w-full rounded-md border border-gray-200  border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 `}
            >
              {infrastructureData?.results.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nom}
                </option>
              ))}
            </select>
            {errors.infrastructure && (
              <p className="text-red-500 text-sm">
                {errors.infrastructure.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            // disabled={mutationCreateInspection.isPending}
            className="w-full bg-green-600 text-gray-200"
          >
            {mutationCreateInspection.isPending
              ? "Chargement..."
              : " Ajouter Inspection"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormInspections;
