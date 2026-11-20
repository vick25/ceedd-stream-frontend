import { authService } from "@/services/auth";
import { setToken } from "@/lib/session";
import { useAppStore } from "@/store/appStore";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAuth = () => {
  const setUser = useAppStore((state) => state.setUser);
  // console.log(setUser);
  return useMutation({
    mutationFn: (credentials: any) => authService.login(credentials),
    onSuccess: ({ user, access }: any) => {
      setUser(user);
      setToken(access);
      toast.success("Connexion réussie!");
    },
    onError: (error: any) => {
      toast.error("Impossible de se connecter");
    },
  });
};

export const useLogOut = () => {
  const logOut = useAppStore((state) => state.logout);
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logOut();
      window.location.href = "/";
      toast.success("Déconnexion réussie");
    },
  });
};
