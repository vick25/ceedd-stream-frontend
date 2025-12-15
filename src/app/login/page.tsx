"use client";
import { useAuth } from "@/components/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Value } from "@radix-ui/react-select";
import { ArrowBigLeft, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const loginMutation = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await loginMutation.mutateAsync(formData);
    router.push("/dashboard");

    // try {

    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-sm border border-gray-300">
        <CardHeader className="space-y-1 flex flex-col gap-3">
          <Link href="/" className="flex text-gray-700">
            <ArrowBigLeft className="text-gray-700" />
            Retour
          </Link>
          <CardTitle className="text-2xl font-bold text-left">Ceedd</CardTitle>
          <CardDescription className="text-left text-sm text-gray-700">
            Connectez-vous à votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Username:
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  className="pl-9 border border-gray-300"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*******"
                  className="pl-9 border border-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 text-white "
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "...Chargement" : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {/* <Button
            type="button"
            variant="outline"
            className="w-full"
            // onClick={() => router.push("/reset-password")}
          >
            Mot de passe oublié ?
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
