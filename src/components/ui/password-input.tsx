"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "./input";

// Champ mot de passe avec un bouton œil pour afficher / masquer la saisie.
// Il accepte les mêmes props qu'<Input> (id, name, value, onChange…),
// sauf "type", qu'il gère lui-même.
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type">
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        // le navigateur affiche le texte en clair quand type="text"
        type={visible ? "text" : "password"}
        // pr-10 : laisse la place au bouton pour que le texte ne passe pas dessous
        className={cn("pr-10", className)}
        ref={ref}
        {...props}
      />
      <button
        // type="button" : sinon, dans un <form>, le clic enverrait le formulaire
        type="button"
        onClick={() => setVisible((v) => !v)}
        // lecteurs d'écran : annonce l'action et l'état du bouton
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        aria-controls={props.id}
        title={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        disabled={props.disabled}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 focus-visible:text-gray-700 focus-visible:outline-none disabled:opacity-50"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
