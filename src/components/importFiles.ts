import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

type FieldName = "url";

// Ce que l'application accepte d'envoyer à Cloudinary.
// (À doubler par les mêmes règles sur le preset dans la console Cloudinary :
// ce contrôle-ci se contourne en appelant Cloudinary directement.)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

type ImageProps = {
  fieldName: FieldName;

  setFormData: (value: any | ((prev: any) => any)) => void;
};
export const useUplaoderImage = (CLOUDINARY_URL: any) => {
  const [loadingRccm, setLoadingRccm] = useState(false);
  const [urlLoading, setLoadingUrl] = useState(false);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    { fieldName, setFormData }: ImageProps
  ) => {
    const { files }: any = e.target;
    // "legnth" (faute de frappe) valait toujours undefined : le test ne
    // protégeait de rien et files[0] pouvait être undefined.
    if (!files || files.length === 0) return;

    const file: File = files[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format non autorisé : JPG, PNG ou WEBP uniquement.");
      e.target.value = ""; // vide le champ pour pouvoir choisir un autre fichier
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Fichier trop lourd : ${MAX_SIZE_MB} Mo maximum.`);
      e.target.value = "";
      return;
    }

    const setLoading = fieldName === "url" ? setLoadingUrl : () => {};
    // "image" et non "auto" : Cloudinary refuse alors tout ce qui n'est pas une image
    const resourceType = "image";
    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "ceedd_upload");
      formDataUpload.append("resource_type", resourceType);

      const response = await axios.post(CLOUDINARY_URL, formDataUpload);
      const secureUrl = response.data.secure_url;

      setFormData((prev: any) => ({ ...prev, [fieldName]: secureUrl }));

      // successToast(`Fichier ${fieldName.toUpperCase()} téléchargé avec succès`);
      toast.success(
        `Fichier ${fieldName.toUpperCase()} téléchargé avec succès`
      );
      return secureUrl;
    } catch (error) {
      console.error(
        `Erreur lors du téléchargement du fichier ${fieldName} :`,
        error
      );
      toast.error(
        `Échec du téléchargement du fichier ${fieldName.toUpperCase()}`
      );
    } finally {
      setLoading(false);
    }
  };
  return {
    handleFileUpload,
    urlLoading,
  };
};
