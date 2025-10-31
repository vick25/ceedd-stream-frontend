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
import { useCustomers } from "@/components/hooks/useCustomer";
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

const clientSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  postnom: z.string().min(1, "le post nom est requis"),
  prenom: z.string().min(1, "Le Prenom est requis"),
  sexe: z.string().min(1, "Le sexe est requis"),
  avenue: z.string().min(1, "La avenue est requise"),
  quartier: z.string().min(1, "La capacité est requise"),
  numero: z.string().min(1, "Le  est requise"),
  telephone: z.string().min(1, "Le numero de telephone est requis"),
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
  commune: z.string().min(1, "Veuillez veuillez entrer une addrese email."),
});

type ClientFormData = z.infer<typeof clientSchema>;

const CreateFormClient = () => {
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

  const mutationCreateInfrastructure = useCreateInfrastructure();
  const { data: typeInfrastructure, isLoading } = useTypeInfradtructures();
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers();
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
    await mutationCreateInfrastructure.mutateAsync(payload);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 flex flex-col gap-3">
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
            <Label htmlFor="postnom">postnom </Label>
            <Input
              id="postnom"
              type="text"
              placeholder="postnom"
              {...register("postnom")}
              className={`border border-white ${
                errors.postnom
                  ? "border border-red-500"
                  : touchedFields.postnom
                  ? "border border-green-600"
                  : "border border-gray-300"
              }`}
            />
            {errors.postnom && (
              <p className="text-red-500 text-sm">{errors.postnom.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="prenom">prenom:</Label>
            <Input
              id="prenom"
              type="prenom"
              placeholder="prenom"
              {...register("prenom")}
            />
            {errors.prenom && <p>{errors.prenom?.message}</p>}
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="sexe">sexe </Label>

            <input
              id="sexe"
              type="checkbox"
              placeholder="sexe"
              className="h-10"
              {...register("sexe")}
            />
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
            />
            {errors.avenue && (
              <p className="text-red-500 text-sm">{errors.avenue.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="quartier">quartier : </Label>
            <Input
              id="quartier"
              type="text"
              placeholder="quartier"
              {...register("quartier")}
            />
            {errors.quartier && (
              <p className="text-red-500 text-sm">{errors.quartier.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="numero">numero : </Label>
            <Input
              id="numero"
              type="text"
              {...register("numero")}
              placeholder="numero"
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
            />
            {errors.telephone && (
              <p className="text-red-500 text-sm">{errors.telephone.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">email :</Label>
            <Input
              id="email"
              type="text"
              {...register("email")}
              placeholder="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={mutationCreateInfrastructure.isPending}
            className="w-full bg-green-600 text-gray-200"
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

export default CreateFormClient;
