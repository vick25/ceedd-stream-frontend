import { useInfrastructureDeleted } from "@/hooks/useInfrastructure";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Callout, IconButton } from "@radix-ui/themes";
import { InfoIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type props = {
  id: string;
  nom: string;
  setInfrastructureDeleted: (id: string) => void;
};
const DeleteInfrastructure = ({ id, nom, setInfrastructureDeleted }: props) => {
  const [formData, setFormData] = useState({
    nom: "",
  });
  const mutationDeleteInfrastructure = useInfrastructureDeleted();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom === `supprimer l'infrastructure ${nom}`) {
      mutationDeleteInfrastructure.mutateAsync(id);
    }
  };

  useEffect(() => {
    if (mutationDeleteInfrastructure.isSuccess && setInfrastructureDeleted) {
      setInfrastructureDeleted(id);
    }
  }, [mutationDeleteInfrastructure.isSuccess]);
  return (
    <Dialog>
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
        <DialogTitle>Suppression de l'infrastructure {nom}</DialogTitle>
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoIcon />
          </Callout.Icon>
          <Callout.Text className="text-sm">
            Pour supprimer l'infrastructure, entrer:
            <strong>supprimer l'infrastructure {nom}</strong> puis cliquer sur
            supprimer
          </Callout.Text>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" type="text" onChange={handleChange} />
            </div>
            <Button
              type="submit"
              disabled={
                mutationDeleteInfrastructure.isPending ||
                formData.nom !== `supprimer l'infrastructure ${nom}`
              }
              className="bg-green-600 text-white"
            >
              {mutationDeleteInfrastructure.isPending
                ? "Chargement ..."
                : "Supprimer"}
            </Button>
          </form>
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInfrastructure;
