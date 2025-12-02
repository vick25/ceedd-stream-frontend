"use client";

import { Locale, useTranslations } from "@/lib/i18n";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import Table from "@/components/ui/zones/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import CreateFormZone from "@/components/ui/zones/CreateFormZone";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type Props = {};

const page = (props: Props) => {
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }
  return (
    <main className="container py-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.navigation.dashboard}</h1>
        <div className="flex gap-2"></div>
      </div>
      <div className="p-4 sm:p-6 flex items-center justify-center">
        <div
          className="
          flex flex-col items-center justify-center 
          w-full h-64 p-6 
          border-2 border-dashed border-gray-300 
          rounded-xl bg-gray-50 
          transition duration-300 ease-in-out
          hover:bg-gray-100 hover:border-gray-400
        "
        >
          {/* Bouton d'Upload Central */}
          <input type="file" name="url" id="url" hidden />
          <label
            htmlFor="url"
            className="
            flex items-center space-x-2 
            px-6 py-3 mb-4 
            text-base font-medium text-gray-700 
            bg-white 
            border border-gray-300 rounded-lg 
            shadow-sm 
            hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            cursor-pointer
          "
          >
            {/* Icône de Téléchargement (SVG) */}
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              ></path>
            </svg>
            <span>Upload</span>
          </label>

          {/* Texte d'Instructions */}
          <p className="text-sm text-gray-500 mb-1">Choisir une image.</p>
          <p className="text-xs text-gray-400">
            **JPG, JPEG, PNG and WEBP. Max 20 MB.**
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
