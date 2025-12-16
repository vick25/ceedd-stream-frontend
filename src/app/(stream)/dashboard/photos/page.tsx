"use client";

import { Locale, useTranslations } from "@/lib/i18n";
import React, { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";

import { usePhoto } from "@/components/hooks/usePhotos";
import { useUplaoderImage } from "@/components/importFiles";

import Image from "next/image";

type Props = {};

const page = (props: Props) => {
  const { user, _hasHydrated, isAuthenticated } = useAppStore();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = useTranslations(locale);
  const [isClosed, setIsClosed] = useState(false);
  const [secureUrl, SetSecureUrl] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const mutationPhoto = usePhoto();
  const [formData, setFormData] = useState({
    url: "",
  });
  const handleDelete = () => {
    SetSecureUrl("");
  };

  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  const { handleFileUpload, urlLoading } = useUplaoderImage(CLOUDINARY_URL);
  const uploadUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setLocalPreview(URL.createObjectURL(file));

      handleFileUpload(e, {
        fieldName: "url",
        setFormData,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mutationPhoto.mutateAsync(formData);
  };
  // const
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
    <main className="container py-6 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {t.navigation.dashboard}
        </h1>
        <div className="flex gap-2"></div>
      </div>

      <hr className="my-4 border border-gray-200" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <div
          className="
                w-full max-w-sm h-64 border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner
                flex items-center justify-center bg-gray-100 relative
            "
        >
          {localPreview ? (
            <Image
              src={localPreview}
              alt="Aperçu de la photo"
              fill
              className="transition-opacity duration-300 object-cover"
            />
          ) : (
            <p className="text-gray-500 text-center p-4">
              {urlLoading
                ? "Chargement de la prévisualisation..."
                : "Sélectionnez une image pour l'aperçu."}
            </p>
          )}
        </div>

        {/* B. Zone d'Upload et de Soumission */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full max-w-sm"
        >
          {/* Zone de Drag & Drop/Click (Input File) */}
          <div
            className="
                        flex flex-col items-center justify-center
                        w-full h-64 p-6
                        border-2 border-dashed border-gray-300
                        rounded-xl bg-gray-50
                        transition duration-300 ease-in-out
                        hover:bg-gray-100 hover:border-indigo-400
                    "
          >
            {/* Input Fichier Caché */}
            <input
              type="file"
              name="url"
              id="url"
              hidden
              accept="image/*"
              onChange={uploadUrl}
            />

            {/* Label (Bouton d'action) */}
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
              {/* Icône SVG */}
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
              <span>
                {urlLoading ? "Upload en cours..." : "Sélectionner la photo"}
              </span>
            </label>

            {/* Instructions */}
            <p className="text-sm text-gray-500 mb-1">Choisir une image.</p>
            <p className="text-xs text-gray-400">
              **JPG, JPEG, PNG and WEBP. Max 20 MB.**
            </p>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            className="
                        w-full
                        px-6 py-3
                        text-base font-semibold text-white
                        bg-indigo-600 rounded-lg
                        shadow-md
                        hover:bg-indigo-700
                        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500
                        transition duration-150 ease-in-out
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                    "
            disabled={urlLoading || mutationPhoto.isPending || !formData.url} // Désactiver si upload Cloudinary, mutation backend ou pas d'URL
          >
            {mutationPhoto.isPending
              ? "Sauvegarde en cours..."
              : "Sauvegarder l'image"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default page;
