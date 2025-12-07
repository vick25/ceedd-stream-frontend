import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

type FieldName = "url";

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
    if (files.legnth == 0) return;

    const setLoading = fieldName === "url" ? setLoadingUrl : () => {};
    const resourceType = fieldName === "url" ? "auto" : "auto";
    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", files[0]);
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
