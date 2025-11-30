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
import { useUpdateBailleurs } from "../hooks/useBailleur";
interface BailleurProps {
  id: string;
  nom: string;
  sigle: string;
}
const EditBailleur = ({ id, nom, sigle }: BailleurProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    sigle: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateBailleurs = useUpdateBailleurs();
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
      await updateBailleurs.mutateAsync({ data: formData, id });
      await queryClient.invalidateQueries({ queryKey: ["zone_contributives"] });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        sigle,
      });
    }
  }, [nom, sigle]);

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
        <DialogTitle>Modifier le Bailleur </DialogTitle>
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
              <Label htmlFor="sigle">sigle:</Label>
              <Input
                id="sigle"
                name="sigle"
                type="text"
                required
                value={formData.sigle}
                onChange={handleChange}
              />
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateBailleurs.isPending}
              >
                {updateBailleurs.isPending
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

export default EditBailleur;
