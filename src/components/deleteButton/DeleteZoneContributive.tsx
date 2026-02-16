import { useZoneContributiveDeleted } from "@/hooks/useZoneContributive";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Callout, IconButton } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type props = {
  id: string;
  nom: string;
  setZoneContributide: (id: string) => void;
};

const DeleteZoneContributide = ({ id, nom, setZoneContributide }: props) => {
  const [formData, setFormData] = useState({
    nom: "",
  });
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const mutationZoneContributive = useZoneContributiveDeleted();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom === `supprimer la zone ${nom}`) {
      try {
        await mutationZoneContributive.mutateAsync(id);
        // console.log("Mutation reussie !!");
        setIsOpen(false);
        // console.log("Dialogue fermer !!");
      } catch (error) {
        console.error("Erreur lors de la suppression de la zone :", error);

        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (mutationZoneContributive.isSuccess && setZoneContributide) {
      setZoneContributide(id);
    }
  }, [mutationZoneContributive.isSuccess]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="red"
          className="px-3 py-2 rounded-md border border-gray-200"
        >
          <Trash size={20} className="text-red-600" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle>Suppression la zone {nom}</DialogTitle>
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoIcon />
          </Callout.Icon>
          <Callout.Text className="text-sm">
            Pour supprimer la zone, entrer:
            <strong>supprimer la zone contributide {nom}</strong> puis cliquer
            sur supprimer
          </Callout.Text>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" type="text" onChange={handleChange} />
            </div>
            <Button
              type="submit"
              disabled={
                mutationZoneContributive.isPending ||
                formData.nom !== `supprimer la zone ${nom}`
              }
              className="bg-green-600 text-white"
            >
              {mutationZoneContributive.isPending
                ? "Chargement ..."
                : "Supprimer"}
            </Button>
          </form>
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteZoneContributide;
