import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCustomers } from "@/hooks/useCustomer";
import { ClientFormData, clientSchema } from "@/lib/schema";
import { useAppStore } from "@/store/appStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateFormClientProps {
  onFormSuccess: () => void;
}

const CreateFormClient = ({ onFormSuccess }: CreateFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      postnom: "",
      prenom: "",
      sexe: "",
      titre: "",
      engagement: "",
      avenue: "",
      quartier: "",
      numero: "",
      telephone: "",
      email: "",
      commune: "",
    },
  });

  console.log("Erreurs actuelles:", errors);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();

  const mutationCreateCustomers = useCreateCustomers();

  // const {data:zonesData,isLoading:isZonesLoading}=useZone()

  const formSubmit = async (data: ClientFormData) => {
    const payload = { ...data };

    // const payload = {
    //   nom: data.nom,
    //   postnom: data.postnom,
    //   prenom: data.prenom,
    //   sexe: data.sexe,
    //   titre: data.titre,
    //   engagement: data.engagement,
    //   avenue: data.avenue,
    //   quartier: data.quartier,
    //   numero: data.numero,
    //   telephone: data.telephone,
    //   email: data.email,
    //   commune: data.commune,
    // };

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
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="nom">Nom<span className="text-red-500">*</span></Label>
          <Input
            id="nom"
            type="text"
            placeholder="nom"
            {...register("nom")}
            className={`border border-gray-300`}
          />
          {errors.nom && (
              <p className="text-red-500 text-sm">{errors.nom.message}</p>
            )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="postnom">Postnom</Label>
          <Input
            id="postnom"
            type="text"
            placeholder="postnom"
            {...register("postnom")}
            className={`borderborder-gray-200`}
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prenom</Label>
          <Input
            id="prenom"
            type="prenom"
            placeholder="prenom"
            {...register("prenom")}
            className={`borderborder-gray-200`}
          />
          {/* {errors.prenom && <p>{errors.prenom?.message}</p>} */}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="sexe">Sexe<span className="text-red-500">*</span></Label>
          <select
            id="sexe"
            {...register("sexe")}
            className={`flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.sexe
              ? "border border-red-500"
              : "border border-gray-200"
              }`}
          >
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
          {errors.sexe && (
            <p className="text-red-500 text-sm ">{errors.sexe.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="titre">Titre</Label>
          <Input
            id="titre"
            type="text"
            placeholder="titre"
            {...register("titre")}
            className={`borderborder-gray-200`}
          />
          {/* {errors.prenom && <p>{errors.prenom?.message}</p>} */}
        </div>
        <div>
          <Label htmlFor="engagement">Engagement</Label>
          <Input
            id="engagement"
            type="checkbox"
            placeholder="engagement"
            {...register("engagement")}
            className={"borderborder-white"}
          />
          {/* {errors.prenom && <p>{errors.prenom?.message}</p>} */}
        </div>
        <div>
          <Label htmlFor="numero">Numéro</Label>
          <Input
            id="numero"
            type="text"
            {...register("numero")}
            placeholder="numéro"
            className="borderborder-gray-200"
          />
          {errors.numero && (
            <p className="text-red-500 text-sm">{errors.numero.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="avenue">Avenue</Label>
          <Input
            id="avenue"
            type="avenue"
            placeholder="avenue"
            {...register("avenue")}
            className="border-gray-200 border"
          />
          {/* {errors.avenue && (
              <p className="text-red-500 text-sm">{errors.avenue.message}</p>
            )} */}
        </div>
        <div>
          <Label htmlFor="quartier">Quartier</Label>
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
          <Label htmlFor="commune">
            Commune<span className="text-red-500">*</span>
          </Label>
          <Input
            id="commune"
            type="text"
            placeholder="commune"
            {...register("commune")}
            className="border border-gray-200"
          />
          {errors.commune && (
            <p className="text-red-500 text-sm">{errors.commune?.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            type="text"
            {...register("telephone")}
            placeholder="téléphone"
            className="border border-gray-200"
          />
          {/* {errors.telephone && (
              <p className="text-red-500 text-sm">{errors.telephone.message}</p>
            )} */}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">E-mail</Label>
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

      <div className="w-full flex items-center justify-end gap-3 mt-1 pt-6 border-t border-gray-200">
        <Button
          type="button"
          className="w-fit bg-gray-600 hover:bg-gray-700 text-gray-100 px-5 py-2 h-auto text-sm font-medium"
          onClick={onFormSuccess}
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
            : "Ajouter Client"}
        </Button>
      </div>
    </form>
  );
};

export default CreateFormClient;
