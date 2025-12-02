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

import { useCreateZoneContributives } from "@/components/hooks/useZoneContributive";
import {
  useBailleurs,
  useCreateBailleurs,
} from "@/components/hooks/useBailleur";
interface FormData {
  nom: string;
  sigle: string;
}

interface BailleurFormProps {
  onFormSuccess: () => void;
}

const bailleurSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  sigle: z.string().optional(),
});

type BailleurFormData = z.infer<typeof bailleurSchema>;

const CreateBailleur = ({ onFormSuccess }: BailleurFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<BailleurFormData>({
    resolver: zodResolver(bailleurSchema),
    defaultValues: {
      nom: "",
      sigle: "",
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateBailleurs = useCreateBailleurs();

    const onSubmit = async (data: BailleurFormData) => {
    // Handle form submission logic here
    const payload = {
      nom: data.nom,
      sigle: data.sigle,
    };
    await mutationCreateBailleurs.mutateAsync(payload);

    await queryClient.invalidateQueries({ queryKey: ["bailleurs"] });
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
            <Label htmlFor="sigle">sigle </Label>
            <Input
              id="sigle"
              type="text"
              placeholder="sigle"
              {...register("sigle")}
              className={`border border-gray-200 `}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={mutationCreateBailleurs.isPending}
            className="w-full bg-green-600 text-gray-200"
          >
            {mutationCreateBailleurs.isPending
              ? "Chargement..."
              : " Ajouter Zone"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBailleur;
