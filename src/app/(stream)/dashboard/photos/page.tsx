"use client";

import { Locale, useTranslations } from "@/lib/i18n";
import React, { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import { useAppStore } from "@/store/appStore";
import { useRouter } from "next/navigation";

import { usePhoto } from "@/components/hooks/usePhotos";
import { useUplaoderImage } from "@/components/importFiles";

import { useBailleurs } from "@/components/hooks/useBailleur";
import { useInfrastructures } from "@/components/hooks/useInfrastructure";
import { allawedTypesInfrastructure } from "@/types";
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
  const [enumData, setEnumData] = useState("");
  const [infrastructures, setInfrastructures] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // console.log(enumData);
  const mutationPhoto = usePhoto();
  const { data: infrastructureData, isPending } = useInfrastructures();
  const { data: bailleurData, isPending: isBailleurLoading } = useBailleurs();
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

    const payload = {
      url: formData.url,
      model_name: enumData,
      object_id: infrastructures,
    };

    await mutationPhoto.mutateAsync(payload);
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

      <div className="flex flex-col  md:flex-row  gap-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg items-start">
        {/* B. Zone d'Upload et de Soumission */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-sm"
        >
          {/* A. Zone de Sélection de Fichier */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Photo de l'infrastructure
            </span>

            <div className="relative group">
              <input
                type="file"
                name="url"
                id="url"
                className="hidden"
                accept="image/*"
                onChange={uploadUrl}
              />

              <label
                htmlFor="url"
                className={`
          flex flex-col items-center justify-center w-full h-32
          border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200
          ${urlLoading
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-300 bg-gray-50 group-hover:bg-white group-hover:border-indigo-400 group-hover:shadow-md"
                  }
        `}
              >
                {urlLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm font-medium text-indigo-600">
                      Téléchargement...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {formData.url
                        ? "Changer la photo"
                        : "Sélectionner une photo"}
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG ou WebP
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* B. Sélection de l'Infrastructure */}
          {/* --- SÉLECTEUR DE TYPE (MAÎTRE) --- */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="enum"
              className="text-sm font-semibold text-gray-700"
            >
              Que voulez-vous lier à cette photo ?
            </label>
            <div className="relative">
              <select
                name="enum"
                id="enum"
                className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                onChange={(e) => {
                  setEnumData(e.target.value);
                  // Optionnel: réinitialiser l'id sélectionné si on change de type
                  setInfrastructures("");
                }}
                value={enumData}
              >
                <option value="">Choisir un type...</option>
                {Object.values(allawedTypesInfrastructure).map((type: any) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                    {/* Capitalise le texte */}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* --- AFFICHAGE CONDITIONNEL : INFRASTRUCTURE --- */}
          {enumData === allawedTypesInfrastructure.infrastructure && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label
                htmlFor="infrastructure"
                className="text-sm font-semibold text-gray-700"
              >
                Sélectionner l'Infrastructure
              </label>
              <div className="relative">
                <select
                  name="infrastructure"
                  id="infrastructure"
                  className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  onChange={(e) => setInfrastructures(e.target.value)}
                >
                  <option value="">Choisir l'infrastructure...</option>
                  {infrastructureData?.results.map((infra: any) => (
                    <option key={infra.id} value={infra.id}>
                      {infra.nom}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* --- AFFICHAGE CONDITIONNEL : BAILLEUR --- */}
          {enumData === allawedTypesInfrastructure.bailleur && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label
                htmlFor="bailleur"
                className="text-sm font-semibold text-gray-700"
              >
                Sélectionner le Bailleur
              </label>
              <div className="relative">
                <select
                  name="bailleur"
                  id="bailleur"
                  className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
                  onChange={(e) => setInfrastructures(e.target.value)} // On réutilise le même state pour l'ID final
                >
                  <option value="">Choisir le bailleur...</option>
                  {bailleurData?.results.map((bail: any) => (
                    <option key={bail.id} value={bail.id}>
                      {bail.nom}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {/* C. Bouton de Soumission */}
          <button
            type="submit"
            disabled={urlLoading || mutationPhoto.isPending || !formData.url}
            className="
      relative flex items-center justify-center w-full px-6 py-3
      text-sm font-bold text-white uppercase tracking-wider
      bg-indigo-600 rounded-lg shadow-lg
      hover:bg-indigo-700 hover:-translate-y-0.5
      active:translate-y-0
      focus:ring-4 focus:ring-indigo-500/30 focus:outline-none
      disabled:bg-gray-300 disabled:translate-y-0 disabled:shadow-none
      transition-all duration-200
    "
          >
            {mutationPhoto.isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traitement...
              </span>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </form>
        <div
          className=" w-full max-w-sm h-64 border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner
                flex items-center  bg-gray-100 relative
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
      </div>
    </main>
  );
};

export default page;
