import { useUpdateBailleurs } from "@/hooks/useBailleur";
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
      await queryClient.invalidateQueries({ queryKey: ["bailleurs"] });
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
          className="px-3 py-2 rounded-md border border-gray-200 text-red-800 "
        >
          <PencilLine size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="bg-white z-9999 ">
        <DialogTitle>Modifier le Bailleur</DialogTitle>
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
              <Label htmlFor="sigle">Sigle</Label>
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
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateBailleurs.isPending}
              >
                {updateBailleurs.isPending
                  ? "Chargement ..."
                  : "Mettre à jour le bailleur"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBailleur;
