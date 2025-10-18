import { serviceCustomer } from "@/services/customer";
import { useMutation } from "@tanstack/react-query";
import { error } from "console";

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
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
