import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconButton } from "@radix-ui/themes";
import { PencilLine } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Client,
  InfrastructureTypes,
  // zone_contributive,
} from "@/types/infrastructure";
import { Button } from "../ui/button";
import {
  useGetInfrastructure,
  useUpdateInfrastructure,
} from "../hooks/useInfrastructure";
import {
  useCustomers,
  useGetCustomer,
  useUpdateCustomers,
} from "../hooks/useCustomer";
import { useTypeInfradtructures } from "../hooks/useTypeInfrastructure";
import { Skeleton } from "../ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { useUpdateZoneContributive } from "../hooks/useZoneContributive";
interface ClientProps {
  id: string;
  nom: string;
  superficie: string;
  etat_ravin: string;
  description: string;
  geom: string;
  shapefile_id: string;
}
const EditZoneContributide = ({
  id,
  nom,
  superficie,
  etat_ravin,
  description,
  geom,
  shapefile_id,
}: ClientProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    superficie: "",
    etat_ravin: "",
    description: "",
    geom: "",
    shapefile_id: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateMutationZoneContributive = useUpdateZoneContributive();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();

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

    if (id) {
      await updateMutationZoneContributive.mutateAsync({ data: formData, id });
      await queryClient.invalidateQueries({ queryKey: ["zone_contributives"] });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        superficie,
        etat_ravin,
        description,
        geom,
        shapefile_id,
      });
    }
  }, [nom, superficie, etat_ravin, description, geom, shapefile_id]);

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
      <DialogContent className="bg-white z-9999 ">
        <DialogTitle>Modifier la Zone </DialogTitle>
        <div className="overflow-y-auto max-h-[80vh]">
          {" "}
          <form className="space-y-3 " onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nom">Nom :</Label>
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
              <Label htmlFor="superficie">Superficie:</Label>
              <Input
                id="superficie"
                name="superficie"
                type="text"
                required
                value={formData.superficie}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="sexe">etat_ravin:</Label>
              <select name="" id="">
                <option value="Bon">Bon</option>
              </select>
            </div>
            <div>
              <Label htmlFor="avenue">Description:</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="geom">Geom:</Label>
              <Input
                id="geom"
                name="geom"
                type="text"
                value={formData.geom}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="shapefile_id">Shapefile:</Label>
              <Input
                id="shapefile_id"
                name="shapefile_id"
                type="text"
                value={formData.shapefile_id}
                onChange={handleChange}
              />
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateMutationZoneContributive.isPending}
              >
                {updateMutationZoneContributive.isPending
                  ? "Chargement ..."
                  : "Mettre à jour la zone"}
              </Button>{" "}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditZoneContributide;
