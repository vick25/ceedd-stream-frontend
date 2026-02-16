import { useUpdateZoneContributive } from "@/hooks/useZoneContributive";
import { useAppStore } from "@/store/appStore";
import { IconButton } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
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

interface ClientProps {
  id: string;
  nom: string;
  etat_ravin: string;
  description: string;

  shapefile_id: string;
}
const EditZoneContributide = ({
  id,
  nom,
  etat_ravin,
  description,
  shapefile_id,
}: ClientProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    etat_ravin: "",
    description: "",
    shapefile_id: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateMutationZoneContributive = useUpdateZoneContributive();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        etat_ravin,
        description,
        shapefile_id,
      });
    }
  }, [nom, etat_ravin, description, shapefile_id]);

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
        <DialogTitle>Modifier la Zone</DialogTitle>
        <div className="overflow-y-auto max-h-[80vh]">
          {" "}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="nom">Nom</Label>
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
              <Label htmlFor="etat_ravin">Etat du ravin</Label>
              <select name="etat_ravin" id="etat_ravin">
                <option value="Bon">Bon</option>
                <option value="Moyen">Moyen</option>
                <option value="Mauvais">Mauvais</option>
              </select>
            </div>
            <div>
              <Label htmlFor="avenue">Description</Label>
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
              <Label htmlFor="shapefile_id">Shapefile</Label>
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
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateMutationZoneContributive.isPending}
              >
                {updateMutationZoneContributive.isPending
                  ? "Chargement ..."
                  : "Mettre à jour la zone"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditZoneContributide;
