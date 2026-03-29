import { servicePhotos } from "@/services/photos";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePhoto = () => {
  return useMutation({
    mutationFn: async (data: { url: string }) =>
      servicePhotos.createPhoto(data),
    onSuccess: (response) => {
      toast.success("La photo uploader avec succés");
    },
  });
};
export const useGetPhotoById = (id: string) => {
  return useQuery({
    queryKey: ["photoById", id],
    queryFn: async () => servicePhotos.getPhotoById(id),
    enabled: !!id,
    meta: {
      errorMessage: "Impossible de récupérer la photo",
    },
  });
};
export const useGetPhotos = () => {
  return useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: async ({ pageParam = 0 }) => servicePhotos.getPhotos(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
    meta: {
      errorMessage: "Impossible de récupérer les photos",
    },
  });
};
