import { serviceCustomer } from "@/services/customer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { error } from "console";
import toast from "react-hot-toast";

export const useCustomer = () => {
  return useMutation({
    mutationFn: (id: string) => serviceCustomer.getCustomerId(id),
    onSuccess: (response) => {},
  });
};
export const useGetCustomer = () => {
  return useMutation({
    mutationFn: serviceCustomer.getCustomerAll,
    onSuccess: (response) => {
      // console.log(response);
    },
    onError: (error) => {
      // console.log(error);
      toast.error("Impossible d'afficher les clients");
    },
  });
};

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => serviceCustomer.getCustomerAll(),
  });
};
export const useCreateCustomers = () => {
  return useMutation({
    mutationFn: (data: any) => serviceCustomer.createCustomer(data),
    onSuccess: (response) => {
      toast.success("Le client a été crée avec succées");
    },
    onError: (error) => {
      toast.error("Impossible de créer le client");
    },
  });
};
export const useUpdateCustomers = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: any }) =>
      serviceCustomer.updateCustomer(data, id),
    onSuccess: (response) => {
      toast.success("Mise à jour du client réalisé avec success");
    },
    onError: (error) => {
      toast.error("Impossible de mettre à jour un client");
    },
  });
};
export const useCustomerDeleted = () => {
  return useMutation({
    mutationFn: (id: string) => serviceCustomer.deleteCustomer(id),
    onSuccess: (response) => {
      toast.success("Client supprimée avec succès");
    },
  });
};
