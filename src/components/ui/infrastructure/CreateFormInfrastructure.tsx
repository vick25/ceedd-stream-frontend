import OptionSelect from "@/components/OptionSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers } from "@/hooks/useCustomer";
import { useCreateInfrastructure } from "@/hooks/useInfrastructure";
import { useTypeInfrastructures } from "@/hooks/useTypeInfrastructure";
import { useZoneContributives } from "@/hooks/useZoneContributive";
import { InfrastructureFormData, infrastructureSchema } from "@/lib/schema";
import { useAppStore } from "@/store/appStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

type CreateformInfrastructureProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type Option = {
  value: string;
  label: string;
};

const CreateFormInfrastructure = ({
  open,
  setOpen,
}: CreateformInfrastructureProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<InfrastructureFormData>({
    resolver: zodResolver(infrastructureSchema),
    defaultValues: {
      nom: "",
      type_infrastructure_id: "",
      date_construction: "",
      latitude: "",
      longitude: "",
      capacite: "",
      unite: "",
      zone: "",
    },
  });

  const { searchTerms, setSearchTerms } = useAppStore();
  const [selectCustomer, setSelectCustomer] = useState<Option | null>(null);
  const mutationCreateInfrastructure = useCreateInfrastructure();
  // const [isOpen,setIsOpen]=useState(false)
  const { data: typeInfrastructure, isLoading } = useTypeInfrastructures();
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers();
  // const {data:zonesData,isLoading:isZonesLoading}=useZone()
  const { data: zoneData, isLoading: isLoandingZone } = useZoneContributives();

  // console.log({ zoneData });
  const onSubmit = async (data: InfrastructureFormData) => {
    // Handle form submission logic here
    const payload = {
      nom: data.nom,
      type_infrastructure_id: data.type_infrastructure_id,
      date_construction: data.date_construction,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      capacite: Number(data.capacite),
      unite: data.unite,
      zone: data.zone,
      client_id: selectCustomer?.value,
    };
    // console.log({ payload });
    // console.log("Données du formulaire:", payload);
    await mutationCreateInfrastructure.mutateAsync(payload);
    setOpen(false);
  };

  const rawData = customersData?.results || [];

  // transformation des données brutes en format compatible select {value,labe}

  const formattedCustomers = rawData.map((customer) => ({
    value: customer.id,
    label: customer.nom,
  }));

  // fonction de recherche demandée par AsyncSelect
  const loadOptions = (inputValue: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      const term = inputValue.trim().toLowerCase();
      const filtered = formattedCustomers.filter((option: Option) =>
        option.label.toLowerCase().includes(term),
      );
      resolve(filtered);
    });
  };

  return (
    <div className="w-full min-w-[50vw] lg:min-w-200 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col gap-4"
      >
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="client_id">
              Client<span className="text-red-500">*</span>
            </Label>
            <OptionSelect
              value={selectCustomer}
              onChange={(option: any) => setSelectCustomer(option)}
              loadOptions={loadOptions}
              placeholder="Chercher un client ..."
              defaultOptions={formattedCustomers.slice(0, 10)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="nom">
              Nom/Code infrastructure<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom"
              type="text"
              placeholder="nom ou code de l'infrastructure"
              {...register("nom")}
              className={`border border-gray-300 ${errors.nom ? "border border-red-500" : "border border-gray-300"
                }`}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm">{errors.nom.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="type_infrastructure_id_id">
              Type infrastructure<span className="text-red-500">*</span>
            </Label>
            <select
              {...register("type_infrastructure_id")}
              className={`flex h-10 w-full  rounded-md  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.type_infrastructure_id
                ? "border border-red-500 "
                : "border border-gray-500"
                }`}
            >
              <option value="">Selectionnez</option>
              {typeInfrastructure?.results.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.nom}
                </option>
              ))}
            </select>
            {errors.type_infrastructure_id && (
              <p className="text-red-500 text-sm">
                {errors.type_infrastructure_id.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="date_construction">
              Date construction<span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_construction"
              type="date"
              placeholder="date_construction"
              {...register("date_construction")}
              className="flex h-10 w-full border border-gray-300 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.date_construction && (
              <p className="text-red-500 text-sm">
                {errors.date_construction?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="latitude">
              Latitude<span className="text-red-500">*</span>
            </Label>
            <Input
              id="latitude"
              type="text"
              placeholder="latitude"
              {...register("latitude")}
              className="flex h-10 w-full border border-gray-300 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.latitude && (
              <p className="text-red-500 text-sm">{errors.latitude.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="longitude">
              Longitude<span className="text-red-500">*</span>
            </Label>
            <Input
              id="longitude"
              type="text"
              placeholder="longitude"
              {...register("longitude")}
              className="flex h-10 w-full border border-gray-300 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.longitude && (
              <p className="text-red-500 text-sm">{errors.longitude.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="capacite">
              Capacité<span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacite"
              type="number"
              placeholder="capacité"
              {...register("capacite")}
              className="flex h-10 w-full border border-gray-300 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.capacite && (
              <p className="text-red-500 text-sm">{errors.capacite.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="unite">
              Unité (L/m<sup>3</sup>)<span className="text-red-500">*</span>
            </Label>
            <Input
              id="unite"
              type="text"
              {...register("unite")}
              placeholder="unité"
              className="flex h-10 w-full border border-gray-300 rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.unite && (
              <p className="text-red-500 text-sm">{errors.unite.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="zone">Zone</Label>
            <select
              {...register("zone")}
              className="flex border border-gray-300 h-10 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selectionnez</option>
              {zoneData?.results.map((zone: any) => (
                <option key={zone.id} value={zone.id}>
                  {zone.nom}
                </option>
              ))}
            </select>
            {/* {errors.zone && (
              <p className="text-red-500 text-sm">{errors.zone.message}</p>
            )} */}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
          {/* Bouton Annuler */}
          <Button
            type="button"
            className="w-fit bg-gray-600 hover:bg-gray-700 text-gray-100 px-5 py-2 h-auto text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>

          {/* Bouton Ajouter */}
          <Button
            type="submit"
            disabled={mutationCreateInfrastructure.isPending}
            className="w-fit bg-blue-600 hover:bg-blue-700 text-gray-200 px-5 py-2 h-auto text-sm font-medium"
          >
            {mutationCreateInfrastructure.isPending
              ? "Chargement..."
              : "Ajouter Infrastructure"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormInfrastructure;
