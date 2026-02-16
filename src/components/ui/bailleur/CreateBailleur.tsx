import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBailleurs } from "@/hooks/useBailleur";
import { BailleurFormData, bailleurSchema } from "@/lib/schema";
import { useAppStore } from "@/store/appStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface BailleurFormProps {
  onFormSuccess: () => void;
}

const CreateBailleur = ({ onFormSuccess }: BailleurFormProps) => {
  const {
    reset,
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

  const formSubmit = async (data: BailleurFormData) => {
    // Handle form submission logic here
    const payload = { ...data };
    await mutationCreateBailleurs.mutateAsync(payload);
    reset();

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
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className="space-y-2 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            type="text"
            placeholder="nom"
            {...register("nom", { required: true })}
            className={`border border-white ${errors.nom
                ? "border border-red-500"
                : touchedFields.nom
                  ? "border border-green-600"
                  : "border border-gray-300"
              }`}
          />
          {errors.nom && (
            <span className="text-red-500 text-sm">{errors.nom.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="sigle">Sigle</Label>
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
          {mutationCreateBailleurs.isPending ? "Chargement..." : "Ajouter Zone"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBailleur;
