import { serviceCustomer } from "@/services/customer";
import { useMutation } from "@tanstack/react-query";

export const useCustomer = () => {
  return useMutation({
    mutationFn: (id: string) => serviceCustomer.getCustomerId(id),
    onSuccess: (response) => {},
  });
};
