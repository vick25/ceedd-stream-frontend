import { DialogTitle } from "@radix-ui/react-dialog";
import { Callout, IconButton } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDeleteBailleurs } from "../hooks/useBailleur";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type props = {
  id: string;
  nom: string;

  setBailleurDelete: (id: string) => void;
};
const DeleteBailleur = ({ id, nom, setBailleurDelete }: props) => {
  const [formData, setFormData] = useState({
    nom: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const mutationDeleteBailleur = useDeleteBailleurs();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom === `supprimer le bailleur ${nom}`) {
      mutationDeleteBailleur.mutateAsync(id, {
        onSuccess: () => {
          if (setBailleurDelete) setBailleurDelete(id);
          queryClient.invalidateQueries({ queryKey: ["bailleurs"] });
          setIsOpen(false);
        },
      });
    }
  };

  useEffect(() => {
    if (mutationDeleteBailleur.isSuccess && setBailleurDelete) {
      setBailleurDelete(id);
    }
  }, [mutationDeleteBailleur.isSuccess]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="red"
          className="px-3 py-2 rounded-md border border-gray-200  "
        >
          <Trash size={20} className="text-red-600" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle>Suppression du bailleur {nom}</DialogTitle>
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoIcon />
          </Callout.Icon>
          <Callout.Text className="text-sm">
            Pour supprimer le bailleur, entrer:
            <strong>supprimer le bailleur {nom} </strong>puis cliquer sur
            supprimer
          </Callout.Text>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nom">Nom :</Label>
              <Input id="nom" name="nom" type="text" onChange={handleChange} />
            </div>
            <Button
              type="submit"
              disabled={
                mutationDeleteBailleur.isPending ||
                formData.nom !== `supprimer le bailleur ${nom}`
              }
              className="bg-green-600 text-white"
            >
              {mutationDeleteBailleur.isPending
                ? "Chargement ..."
                : " Supprimer"}
            </Button>
          </form>
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBailleur;
