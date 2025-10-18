import React from "react";
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
interface InfrastructureProps {
  id: string;
}
const EditInfrastructure = ({ id }: InfrastructureProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          variant="surface"
          color="orange"
          className="px-2 py-1 rounded-md"
        >
          <PencilLine size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Modifier l'organisation</DialogTitle>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name:</Label>
            <Input id="name" name="name" type="text" required />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfrastructure;
