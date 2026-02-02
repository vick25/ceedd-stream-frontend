import { useAppStore } from "@/store/appStore";
import { displayDate } from "@/utils/utils";
import { IconButton } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useInfrastructures
} from "../hooks/useInfrastructure";
import { useUpdateInspection } from "../hooks/useInspection";
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
interface InspectionProps {
  id: string;
  date: Date;
  etat: string;
  inspecteur: string;
  commentaire: string;
  prochain_controle: string;
  infrastructure: string;
}
const EditInspection = ({
  id,
  date,
  etat,
  inspecteur,
  commentaire,
  prochain_controle,
  infrastructure,
}: InspectionProps) => {
  const [formData, setFormData] = useState({
    date: "",
    etat: "",
    inspecteur: "",
    commentaire: "",
    prochain_controle: "",
    infrastructure: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateMutationInspection = useUpdateInspection();
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();

  const { data: infrastructureData, isLoading: isInfrastructureLoading } =
    useInfrastructures();
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
      await updateMutationInspection.mutateAsync({ data: formData, id });
      await queryClient.invalidateQueries({ queryKey: ["inspections"] });
      setIsOpen(false);
    }
  };
  //   useEffect(() => {
  //     mutationInfrastructure.mutate();
  //   }, []);

  useEffect(() => {
    if (id) {
      setFormData({
        date: displayDate(date),
        etat,
        inspecteur,
        commentaire,
        prochain_controle: displayDate(prochain_controle),
        infrastructure,
      });
    }
  }, [date, etat, inspecteur, prochain_controle, commentaire, infrastructure]);

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
        <DialogTitle>Modifier modifier une inspection</DialogTitle>
        <div className="overflow-y-auto max-h-[80vh]">
          {" "}
          <form className="space-y-3 " onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="date">date :</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="etat">Prédate:</Label>
              <Input
                id="etat"
                name="etat"
                type="text"
                required
                value={formData.etat}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="inspection">inspection:</Label>
              <Input
                id="inspection"
                name="inspection"
                type="text"
                value={formData.inspecteur}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="commentaire">commentaire:</Label>
              <Input
                id="commentaire"
                name="commentaire"
                type="text"
                value={formData.commentaire}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="prochain_controle">prochain_controle:</Label>
              <Input
                id="prochain_controle"
                name="prochain_controle"
                type="date"
                value={formData.prochain_controle}
                onChange={handleChange}
                required
              />
            </div>
            {/* <div>
              <Label htmlFor="infrastructure">infrastructure:</Label>
              <Input
                id="infrastructure"
                name="infrastructure"
                type="text"
                value={formData.infrastructure}
                onChange={handleChange}
                required
              />
            </div> */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="infrastructure_id">Infrastructure</Label>
              <select
                id="infrastructure_id"
                name="infrastructure_id"
                // {...register("infrastructure_id")}
                className="h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm"
              >
                <option value="">Sélectionner une infrastructure</option>
                {infrastructureData?.results.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.nom}
                  </option>
                ))}
              </select>
              {/* {errors.infrastructure_id && (
                <p className="text-red-500 text-xs">
                  {errors.infrastructure_id.message}
                </p>
              )} */}
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                //   disabled={createDeliveryMutation.isPending}
                className="w-full bg-green-600 text-gray-200"
                disabled={updateMutationInspection.isPending}
              >
                {updateMutationInspection.isPending
                  ? "Chargement ..."
                  : "Mettre à jour  l'inspection"}
              </Button>{" "}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInspection;
