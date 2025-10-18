import { serviceCustomer } from "@/services/customer";
import { useMutation } from "@tanstack/react-query";

export const useCustomer = () => {
  return useMutation({
    mutationFn: serviceCustomer.getCustomerId,
    onSuccess: (response) => {
      console.log("client", response.results);
    },
  });
};
