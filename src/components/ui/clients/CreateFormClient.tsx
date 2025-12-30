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
import { useCreateInfrastructure } from "@/components/hooks/useInfrastructure";
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
  nom: string;
  postnom: string;
  prenom: string;
  sexe: string;
  avenue: string;
  quartier: string;
  numero: string;
  telephone: string;
  email: string;
  commune: string;
}

interface CreateFormClientProps {
  onFormSuccess: () => void;
}

const clientSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  postnom: z.string().optional(),
  prenom: z.string().optional(),
  sexe: z.string().min(1, "Le sexe est requis").optional(),
  avenue: z.string().optional(),
  quartier: z.string().min(1, "La capacité est requise").optional(),
  numero: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  commune: z.string().min(1, "Veuillez veuillez entrer une commune."),
});

type ClientFormData = z.infer<typeof clientSchema>;

const CreateFormClient = ({ onFormSuccess }: CreateFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      postnom: "",
      prenom: "",
      sexe: "",
      avenue: "",
      quartier: "",
      numero: "",
      telephone: "",
      email: "",
      commune: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateCustomers = useCreateCustomers();

  // const {data:zonesData,isLoading:isZonesLoading}=useZone()

  const onSubmit = async (data: ClientFormData) => {
    // Handle form submission logic here
    const payload = {
      nom: data.nom,
      postnom: data.postnom,
      prenom: data.prenom,
      sexe: data.sexe,
      avenue: data.avenue,
      quartier: data.quartier,
      numero: data.numero,
      telephone: data.telephone,
      email: data.email,
      commune: data.commune,
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
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nom"> Nom:</Label>
            <Input
              id="nom"
              type="text"
              placeholder="nom"
              {...register("nom")}
              className={`border border-white ${
                errors.nom ? "border border-red-500" : "border border-gray-300"
              }`}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm">{errors.nom.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="postnom">postnom </Label>
            <Input
              id="postnom"
              type="text"
              placeholder="postnom"
              {...register("postnom")}
              className={`border border-gray-200 `}
            />
          </div>
          <div>
            <Label htmlFor="prenom">prenom:</Label>
            <Input
              id="prenom"
              type="prenom"
              placeholder="prenom"
              {...register("prenom")}
              className={`border border-white ${
                errors.nom ? "border border-red-500" : "border border-gray-300"
              }`}
            />
            {/* {errors.prenom && <p>{errors.prenom?.message}</p>} */}
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="sexe">sexe </Label>

            <select
              id="sexe"
              {...register("sexe")}
              className={`flex h-10 w-full rounded-md border border-gray-200  border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.sexe
                  ? "border border-red-500 "
                  : "border border-gray-200"
              }`}
            >
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            {errors.sexe && (
              <p className="text-red-500 text-sm ">{errors.sexe.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="avenue">avenue : </Label>
            <Input
              id="avenue"
              type="avenue"
              placeholder="avenue"
              {...register("avenue")}
              className="border-gray-200  border"
            />
            {/* {errors.avenue && (
              <p className="text-red-500 text-sm">{errors.avenue.message}</p>
            )} */}
          </div>
          <div>
            <Label htmlFor="quartier">quartier : </Label>
            <Input
              id="quartier"
              type="text"
              placeholder="quartier"
              {...register("quartier")}
              className="border border-gray-200 "
            />
            {/* {errors.quartier && (
              <p className="text-red-500 text-sm">{errors.quartier.message}</p>
            )} */}
          </div>
          <div>
            <Label htmlFor="commune">commune : </Label>
            <Input
              id="commune"
              type="text"
              placeholder="commune"
              {...register("commune")}
              className="border border-gray-200 "
            />
            {/* {errors.commune && (
              <p className="text-red-500 text-sm">{errors.commune.message}</p>
            )} */}
          </div>
          <div>
            <Label htmlFor="numero">numero : </Label>
            <Input
              id="numero"
              type="text"
              {...register("numero")}
              placeholder="numero"
              className="border border-gray-200 "
            />
            {errors.numero && (
              <p className="text-red-500 text-sm">{errors.numero.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="telephone">Telephone : </Label>
            <Input
              id="telephone"
              type="text"
              {...register("telephone")}
              placeholder="telephone"
              className="border border-gray-200 "
            />
            {/* {errors.telephone && (
              <p className="text-red-500 text-sm">{errors.telephone.message}</p>
            )} */}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">email :</Label>
            <Input
              id="email"
              type="text"
              {...register("email")}
              placeholder="email"
              className="border border-gray-200 "
            />
            {/* {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )} */}
          </div>
        </div>
        <div className=" w-full flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            className="w-fit bg-gray-600 hover:bg-gray-700 text-gray-100 px-5 py-2 h-auto text-sm font-medium"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            size="sm"
            // disabled={mutationCreateCustomers.isPending}
            className="w-fit bg-blue-600 text-gray-200"
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
