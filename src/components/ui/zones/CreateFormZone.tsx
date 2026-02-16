import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInfrastructures } from "@/hooks/useInfrastructure";
import { useCreateZoneContributives } from "@/hooks/useZoneContributive";
import { ZoneFormData, zoneSchema } from "@/lib/schema";
import { useAppStore } from "@/store/appStore";
import { etat_ravin } from "@/types/infrastructure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ZoneFormClientProps {
  onFormSuccess: () => void;
}

const CreateFormZone = ({ onFormSuccess }: ZoneFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      nom: "",
      etat_ravin: etat_ravin.SELECTIONNEZ,
      description: "",
      shapefile_id: "",
    },
  });
  const states = Object.values(etat_ravin);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateZone = useCreateZoneContributives();
  const { data: infrastructures, isLoading: infIsLoading } =
    useInfrastructures();

  // const {data:zonesData,isLoading:isZonesLoading}=useZone()

  const onSubmit = async (data: ZoneFormData) => {
    // Handle form submission logic here
    const payload = {
      nom: data.nom,

      etat_ravin: data.etat_ravin,
      description: data.description,

      shapefile_id: data.shapefile_id,
    };
    await mutationCreateZone.mutateAsync(payload);

    await queryClient.invalidateQueries({ queryKey: ["zone_contributives"] });
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            type="text"
            placeholder="nom"
            {...register("nom")}
            className={`border border-white ${errors.nom ? "border border-red-500" : "border border-gray-300"
              }`}
          />
          {errors.nom && (
            <span className="text-red-500 text-sm">{errors.nom.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Label htmlFor="etat_ravin">Etat ravin</Label>

          <select
            id="etat_ravin"
            {...register("etat_ravin")}
            className={`flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.etat_ravin
              ? "border border-red-500"
              : "border border-gray-300"
              }`}
          >
            <option value={etat_ravin.SELECTIONNEZ} disabled>
              Selectionnez un ravin
            </option>
            {states.map((state, index) => (
              <option key={index}>{state}</option>
            ))}
          </select>
          {errors.etat_ravin && (
            <span className="text-red-500 text-sm ">
              {errors.etat_ravin.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="description"
            placeholder="description"
            {...register("description")}
            className="border border-gray-200 "
          />
          {/* {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )} */}
        </div>

        <div>
          <Label htmlFor="shapefile_id">Shapefile ID</Label>
          <Input
            id="shapefile_id"
            type="number"
            {...register("shapefile_id")}
            placeholder="shapefile_id"
            className="border border-gray-200"
          />
          {errors.shapefile_id && (
            <span className="text-red-500 text-sm">
              {errors.shapefile_id.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={mutationCreateZone.isPending}
          className="w-full bg-green-600 text-gray-200"
        >
          {mutationCreateZone.isPending ? "Chargement..." : "Ajouter Zone"}
        </Button>
      </div>
    </form>
  );
};

export default CreateFormZone;
