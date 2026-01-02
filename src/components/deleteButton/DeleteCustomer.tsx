import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Callout, IconButton } from "@radix-ui/themes";
import { InfoIcon, Trash } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useInfrastructureDeleted } from "../hooks/useInfrastructure";
import { useCustomerDeleted } from "../hooks/useCustomer";
import { boolean } from "zod";
import { useQueryClient } from "@tanstack/react-query";

type props = {
  id: string;
  nom: string;

  setCustomerDeleted: (id: string) => void;
};
const DeleteCustomer = ({ id, nom, setCustomerDeleted }: props) => {
  const [formData, setFormData] = useState({
    nom: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const mutationDeleteCustomer = useCustomerDeleted();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom === `supprimer le client ${nom}`) {
      mutationDeleteCustomer.mutateAsync(id, {
        onSuccess: () => {
          if (setCustomerDeleted) setCustomerDeleted(id);
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          setIsOpen(false);
        },
      });
    }
  };

  useEffect(() => {
    if (mutationDeleteCustomer.isSuccess && setCustomerDeleted) {
      setCustomerDeleted(id);
    }
  }, [mutationDeleteCustomer.isSuccess]);
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
        <DialogTitle>Suppression du client {nom}</DialogTitle>
        <Callout.Root variant="outline">
          <Callout.Icon>
            <InfoIcon />
          </Callout.Icon>
          <Callout.Text className="text-sm">
            Pour supprimer le client, entrer:
            <strong>supprimer le client {nom} </strong>puis cliquer sur
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
                mutationDeleteCustomer.isPending ||
                formData.nom !== `supprimer le client ${nom}`
              }
              className="bg-green-600 text-white"
            >
              {mutationDeleteCustomer.isPending
                ? "Chargement ..."
                : " Supprimer"}
            </Button>
          </form>
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCustomer;
