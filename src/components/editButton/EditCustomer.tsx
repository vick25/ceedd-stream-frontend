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

const EditCustomer = ({
  id,
  nom,
  prenom,
  sexe,
  avenue,
  quartier,
  commune,
}: Client) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    avenue: "",
    quartier: "",
    commune: "",
  });

  const updateMutationCustomer = useUpdateCustomers();

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
    if (id) {
      await updateMutationCustomer.mutateAsync({ data: formData, id });
    }
  };
  //   useEffect(() => {
  //     mutationInfrastructure.mutate();
  //   }, []);

  useEffect(() => {
    if (id) {
      setFormData({
        nom,
        prenom,
        sexe,
        avenue,
        quartier,
        commune,
      });
    }
  }, [nom, prenom, sexe, quartier, avenue, commune]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="orange"
          className="px-3 py-2 rounded-md border border-gray-200 text-gray-800"
        >
          <PencilLine size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white z-[9999]  ">
        <DialogTitle>Modifier le client</DialogTitle>
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
              <Label htmlFor="prenom">Prénom:</Label>
              <Input
                id="prenom"
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="sexe">Sexe:</Label>
              <Input
                id="sexe"
                name="sexe"
                type="text"
                value={formData.sexe}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="avenue">Avenue:</Label>
              <Input
                id="avenue"
                name="avenue"
                type="text"
                value={formData.avenue}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="quartier">Quartier:</Label>
              <Input
                id="quartier"
                name="quartier"
                type="text"
                value={formData.quartier}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="commune">Commune:</Label>
              <Input
                id="commune"
                name="commune"
                type="text"
                value={formData.commune}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateMutationCustomer.isPending}
              >
                {updateMutationCustomer.isPending
                  ? "Chargement ..."
                  : "Mettre à jour le client"}
              </Button>{" "}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomer;
