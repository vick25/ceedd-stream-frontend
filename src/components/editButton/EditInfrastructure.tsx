import { useCustomers } from "@/hooks/useCustomer";
import {
  useUpdateInfrastructure
} from "@/hooks/useInfrastructure";
import { useTypeInfrastructures } from "@/hooks/useTypeInfrastructure";
import { useAppStore } from "@/store/appStore";
import {
  Client,
  Type_infrastructure
} from "@/types/infrastructure";
import { IconButton } from "@radix-ui/themes";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

interface InfrastructureTypesProps {
  id: string;
  nom: string;
  type_infrastructure: Type_infrastructure;
  date_construction: string;
  latitude: string;
  longitude: string;
  capacite: string;
  unite: string;
  zone?: string;
  client: Client;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const EditInfrastructure = ({
  id,
  nom,
  type_infrastructure,
  date_construction,
  latitude,
  longitude,
  capacite,
  unite,
  // zone,
  client,
}: InfrastructureTypesProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    type_infrastructure_id: "",
    date_construction: "",
    latitude: "",
    longitude: "",
    capacite: "",
    unite: "",
    client_id: "",
  });
  // const data = {
  //   ...formData,
  // };
  // const [customers, setCustomers] = useState<Client[]>([]);
  // const [zones, setZones] = useState<zone_contributive[]>([]);
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // const queryClient = useQueryClient();
  // const mutationInfrastructure = useGetInfrastructure();

  const updateMutationInfrastructure = useUpdateInfrastructure();

  const { data: CustomerData, isLoading } = useCustomers();
  const {
    data: typeInfrastructureData,
    isLoading: IsTypeInfrastructureLoading,
  } = useTypeInfrastructures();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const dataToSend = {
    //   ...formData,

    // };
    // On prépare les données au format attendu par l'API
    const dataToSend = {
      nom: formData.nom,
      date_construction: formData.date_construction,
      unite: formData.unite,
      capacite: formData.capacite,
      // Conversion en nombres pour éviter l'erreur "A valid number is required"
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      // Renommage des clés pour correspondre à l'API (client_id et type_infrastructure_id)
      client_id: formData.client_id,
      type_infrastructure_id: formData.type_infrastructure_id,
    };
    if (id) {
      await updateMutationInfrastructure.mutateAsync({ data: dataToSend, id });

      // mutationInfrastructure.mutate();
      setIsOpen(false);
    }
  };
  // useEffect(() => {
  //   mutationInfrastructure.mutate();
  // }, []);

  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        type_infrastructure_id: type_infrastructure?.id,
        date_construction,
        latitude,
        longitude,
        capacite,
        unite,
        client_id: client?.id,
      });
    }
  }, [
    id,
    nom,
    type_infrastructure,
    date_construction,
    latitude,
    longitude,
    capacite,
    unite,
    client,
  ]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="orange"
          className="px-3 py-2 rounded-md border border-gray-200 text-gray-800"
        >
          <PencilLine size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white z-9999  max-w-2xl md:max-w-3xl">
        <DialogTitle>Modifier l'infrastructure</DialogTitle>
        <div className="overflow-y-auto max-h-[80vh]">
          {" "}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom infrastructure</Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="type_infrastructure">
                  Type Infrastructure
                </Label>
                {IsTypeInfrastructureLoading ? (
                  <Skeleton className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                ) : (
                  <select
                    name="type_infrastructure_id"
                    value={formData.type_infrastructure_id}
                    onChange={handleChange}
                    id="type_infrastructure"
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selectionnez</option>
                    {typeInfrastructureData?.results.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <Label htmlFor="date_construction">Date construction</Label>
                <Input
                  id="date_construction"
                  name="date_construction"
                  type="text"
                  value={formData.date_construction}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacite">Capacité</Label>
                <Input
                  id="capacite"
                  name="capacite"
                  type="text"
                  value={formData.capacite}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unite">Unité</Label>
                <Input
                  id="unite"
                  name="unite"
                  type="text"
                  value={formData.unite}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div>
              <Label htmlFor="zone">Zone contrubitive:</Label>
              <select
                name="zone"
                id="zone"
                value={formData.zone}
                className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selectionnez </option>

                <option value="">Citerne</option>
              </select>
            </div> */}
              <div>
                <Label htmlFor="client">Propriétaire</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full rounded-md border border-input bg-background px-3 py-2" />
                ) : (
                  <select
                    name="client_id"
                    id="client"
                    value={formData.client_id}
                    onChange={handleChange}
                    className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selectionnez</option>
                    {CustomerData?.results?.map((cust: any) => (
                      <option key={cust.id} value={cust.id}>
                        {cust.nom}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className=" w-full flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-fit bg-gray-600 hover:bg-gray-700 text-gray-100 px-5 py-2 h-auto text-sm font-medium"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                //   disabled={createDeliveryMutation.isPending}
                className="w-fit bg-blue-600 text-gray-200"
                disabled={updateMutationInfrastructure.isPending}
              >
                {updateMutationInfrastructure.isPending
                  ? "Chargement ..."
                  : "Mettre à jour infrastructure"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfrastructure;
