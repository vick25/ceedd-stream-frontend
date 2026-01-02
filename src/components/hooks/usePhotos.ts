import { servicePhotos } from "@/services/photos";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePhoto = () => {
  return useMutation({
    mutationFn: (data: { url: string }) => servicePhotos.createPhoto(data),
    onSuccess: (response) => {
      toast.success("La photo uploader avec succés");
    },
  });
};
export const useGetPhotoById = (id: string) => {
  return useQuery({
    queryKey: ["photoById", id],
    queryFn: () => servicePhotos.getPhotoById(id),
    enabled: !!id,
    meta: {
      errorMessage: "Impossible de récupérer la photo",
    },
  });
};
export const useGetPhotos = () => {
  return useQuery({
    queryKey: ["photos"],
    queryFn: () => servicePhotos.getPhotos(),
    meta: {
      errorMessage: "Impossible de récupérer les photos",
    },
  });
};
