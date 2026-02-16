import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

import { useInfrastructures } from "@/hooks/useInfrastructure";
import { useCreateInspection } from "@/hooks/useInspection";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { inspection } from "@/types/infrastructure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  infrastructure_id: z.string().min(1, "La capacité est requise").optional(),
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
      infrastructure_id: "",
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
      infrastructure_id: data.infrastructure_id,
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
    <div className="w-full min-w-50vw lg:min-w-800px p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Champ DATE */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            />
            {errors.date && (
              <p className="text-red-500 text-xs">{errors.date.message}</p>
            )}
          </div>

          {/* Champ ETAT */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="etat">État</Label>
            <select
              id="etat"
              {...register("etat")}
              className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionner un état</option>
              {inspections.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.etat && (
              <p className="text-red-500 text-xs">{errors.etat.message}</p>
            )}
          </div>

          {/* Champ INSPECTEUR */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="inspecteur">Inspecteur</Label>
            <Input
              id="inspecteur"
              placeholder="Nom de l'inspecteur"
              {...register("inspecteur")}
              className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Champ INFRASTRUCTURE */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="infrastructure_id">Infrastructure</Label>
            <select
              id="infrastructure_id"
              {...register("infrastructure_id")}
              className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionner une infrastructure</option>
              {infrastructureData?.results.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nom}
                </option>
              ))}
            </select>
            {errors.infrastructure_id && (
              <p className="text-red-500 text-xs">
                {errors.infrastructure_id.message}
              </p>
            )}
          </div>

          {/* Champ PROCHAIN CONTROLE */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="prochain_controle">Prochain contrôle</Label>
            <Input
              id="prochain_controle"
              type="date"
              {...register("prochain_controle")}
              className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            />
          </div>

          {/* Champ COMMENTAIRE */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label htmlFor="commentaire">Commentaire</Label>
            <textarea
              id="commentaire"
              {...register("commentaire")}
              className="flex min-h-80px w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
            />
            {errors.commentaire && (
              <p className="text-red-500 text-xs">
                {errors.commentaire.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-fit flex gap-3 mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border border-gray-200"
            onClick={() => onFormSuccess()}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={mutationCreateInspection.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {mutationCreateInspection.isPending
              ? "Chargement..."
              : "Ajouter Inspection"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormInspections;
