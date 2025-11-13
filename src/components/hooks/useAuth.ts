import { authService } from "@/services/auth";
import { useAppStore } from "@/store/appStore";
import { useMutation } from "@tanstack/react-query";
import { error } from "console";
import toast from "react-hot-toast";

export const useAuth = () => {
  const setUser = useAppStore((state) => state.setUser);
  // console.log(setUser);
  return useMutation({
    mutationFn: (credentials: any) => authService.login(credentials),
    onSuccess: ({ user, access }: any) => {
      setUser(user);
      localStorage.setItem("ceeAuth-token", access);
      toast.success("Connexion réussie!");
    },
    onError: (error: any) => {
      toast.error("Impossible de se connecter");
    },
  });
};
