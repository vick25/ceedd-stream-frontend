import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Callout, IconButton } from "@radix-ui/themes";
import { InfoIcon, Trash } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

type props = {
  id: string;
  nom: string;
};
const DeleteInfrastructure = ({ id, nom }: props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="red"
          className="px-2 py-1 rounded-md"
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
        </Callout.Root>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInfrastructure;
