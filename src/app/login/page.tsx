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
import { Lock, User } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* <div className="w-full max-w-md">
        <div>
          <div>
            <h1>Connexion</h1>
            <p>Connectez-vous à votre compte</p>
          </div>
          <div className="flex flex-col justify-center">
            <form className="space-y-4">
              <div>
                <label htmlFor="username">Username</label>
                <Input id="email" />
              </div>
              <div>
                <label htmlFor="password">password:</label>
                <Input id="password" type="password" placeholder="Saisir votre mon de passe" />
              </div>
            </form>
          </div>
        </div>
      </div> */}
      <Card className="w-full max-w-md bg-white shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-left">Ceedd</CardTitle>
          <CardDescription className="text-left">
            Connectez-vous à votre compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username:</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="username"
                  placeholder="username"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*******"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 text-white ">
              {/* {loading ? "...Chargement" : "Se connecter"} */}
              Se connecter
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            // onClick={() => router.push("/reset-password")}
          >
            Mot de passe oublié ?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
