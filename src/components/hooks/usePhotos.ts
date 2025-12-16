import { servicePhotos } from "@/services/photos";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePhoto = () => {
  return useMutation({
    mutationFn: (data: { url: string }) => servicePhotos.createPhoto(data),
    onSuccess: (response) => {
      toast.success("La photo uploader avec succés");
    },
  });
};
