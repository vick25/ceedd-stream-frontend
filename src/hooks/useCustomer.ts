import { serviceCustomer } from "@/services/customer";
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCustomer = () => {
  return useMutation({
    mutationFn: (id: string) => serviceCustomer.getCustomerId(id),
    onSuccess: (response) => {},
  });
};
export const useGetCustomer = () => {
  return useMutation({
    // fonction fléchée : TanStack Query appelle mutationFn(variables, context),
    // et ce "context" se retrouverait sinon dans le paramètre "limit"
    mutationFn: () => serviceCustomer.getCustomerAll(),
    onSuccess: (response) => {
      // console.log(response);
    },
    onError: (error) => {
      // console.log(error);
      toast.error("Impossible d'afficher les clients");
    },
  });
};

// Une page de clients (pagination côté serveur).
// L'offset fait partie de la clé : chaque page a son propre cache.
// La clé commence par "customers", donc invalidateQueries({ queryKey: ["customers"] })
// rafraîchit toutes les pages d'un coup.
export const useCustomers = (offset: number = 0) => {
  return useQuery({
    queryKey: ["customers", "page", offset],
    queryFn: () => serviceCustomer.getCustomerAll(offset),
    // garde la page précédente affichée pendant le chargement de la suivante
    placeholderData: keepPreviousData,
  });
};

// Tous les clients (toutes les pages), pour les listes déroulantes et la recherche.
// Même forme de données { count, results } que useCustomers.
export const useAllCustomers = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["customers", "all"],
    queryFn: () => serviceCustomer.getAllCustomersPages(),
    enabled: options.enabled ?? true,
  });
};
// Détails d'un client. La clé commence par "customers" : quand EditCustomer
// fait invalidateQueries(["customers"]), la fiche se met à jour toute seule.
export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customers", "detail", id],
    queryFn: () => serviceCustomer.getCustomerId(id),
    enabled: !!id, // pas de requête tant que l'id n'est pas connu
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
