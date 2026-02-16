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
  inspecteur: string;
  setInspectionDeleted: (id: string) => void;
};

const DeleteInspection = ({ id, inspecteur, setInspectionDeleted }: props) => {
  const [formData, setFormData] = useState({
    inspecteur: "",
  });
  const mutationDeleteInspection = useInfrastructureDeleted();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.inspecteur === `supprimer l'infrastructure ${inspecteur}`) {
      mutationDeleteInspection.mutateAsync(id);
    }
  };

  useEffect(() => {
    if (mutationDeleteInspection.isSuccess && setInspectionDeleted) {
      setInspectionDeleted(id);
    }
  }, [mutationDeleteInspection.isSuccess]);
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
        <DialogTitle>Suppression de l'infrastructure {inspecteur}</DialogTitle>
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoIcon />
          </Callout.Icon>
          <Callout.Text className="text-sm">
            Pour supprimer l'infrastructure, entrer:
            <strong>supprimer l'infrastructure {inspecteur} </strong>puis
            cliquer sur supprimer
          </Callout.Text>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="inspecteur">Inspecteur</Label>
              <Input
                id="inspecteur"
                name="inspecteur"
                type="text"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              disabled={
                mutationDeleteInspection.isPending ||
                formData.inspecteur !==
                `supprimer l'infrastructure ${inspecteur}`
              }
              className="bg-green-600 text-white"
            >
              {mutationDeleteInspection.isPending
                ? "Chargement ..."
                : "Supprimer"}
            </Button>
          </form>
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInspection;
