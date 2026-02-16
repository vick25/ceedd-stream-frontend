import { MapFeature } from "@/types/types";
import { formatDate } from "@/utils/utils";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CylinderGraph } from "./CylinderGraph";
import { useBailleurs } from "@/hooks/useBailleur";

interface FilterCardProps {
  selectedFeature: MapFeature | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filteredFeaturesCount: number;
  onClose: () => void;
  availableCategories: string[];
}

export const FilterCard: React.FC<FilterCardProps> = ({
  selectedFeature,
  selectedCategory,
  onCategoryChange,
  filteredFeaturesCount,
  onClose,
  availableCategories,
}) => {
  const t = useTranslations("FilterCard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: bailleursData } = useBailleurs();

  // Normalize images into an array even if it's just one string
  const images = selectedFeature?.imageUrls
    ? Array.isArray(selectedFeature.imageUrls)
      ? selectedFeature.imageUrls
      : [selectedFeature.imageUrls]
    : [];

  const financeInfo = (bailleursData as any)?.results.find((b: any) =>
    b.finances.some(
      (f: any) => f.infrastructure?.id?.toString() === selectedFeature?.id,
    ),
  );

  // Get bailleur logo with this id
  const logoUrl = selectedFeature?.logoUrls?.[0] || null;
  const finalNom = financeInfo?.nom || financeInfo?.str || "Partenaire";

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // const maxCapacity = selectedFeature?.maxCapacity;
  // const volumeActuel = 4000;

  return (
    <div className="h-full max-h-full flex flex-col p-5 overflow-hidden">
      <div className="sticky top-0 z-20 pb-3 bg-white/95 backdrop-blur-sm">
        {/* Header of Card */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{t("title")}</h2>
          <button
            type="button"
            onClick={onClose}
            title="Close map options"
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="category-select"
              className="text-sm font-semibold text-gray-700"
            >
              {t("description")}
            </label>
            <label className="text-sm font-semibold text-red-700">
              {filteredFeaturesCount}
            </label>
          </div>

          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 bg-gray-50 rounded-lg border cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm hover:bg-white transition-colors"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <hr className="h-0.5 border-0 bg-[linear-gradient(25deg,red_5%,yellow_60%,lime_90%,teal)]" />
      </div>

      {/* Feature Details Section */}
      <div className="flex-1 mt-2 overflow-y-auto overscroll-contain">
        {selectedFeature ? (
          <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800 leading-tight">
                {selectedFeature?.type}
              </h3>
              {/* <span
                className={`px-2 py-1 text-xs rounded-full font-bold whitespace-nowrap ${
                  selectedFeature.state === "Functional"
                    ? "bg-green-100 text-green-700"
                    : selectedFeature.state === "Needs Repair"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedFeature.state}
              </span> */}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Details List */}
              <div className="flex-1 space-y-3">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                  {images.length > 0 && images[0] ? (
                    <Link
                      href="#"
                      scroll={false}
                      onClick={(e) => {
                        e.preventDefault(); // Prevents page jump
                        setIsModalOpen(true);
                      }}
                    >
                      <CldImage
                        src={images[0]}
                        alt={selectedFeature.nom}
                        width="800"
                        height="600"
                        crop="fill"
                        sizes="256px"
                        gravity="auto"
                        className="object-cover max-w-full cursor-pointer"
                      />
                      {/* Optional: Show "Count" overlay if multiple images exist */}
                      {images.length > 1 && (
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          1 / {images.length}
                        </div>
                      )}
                    </Link>
                  ) : (
                    /* Fallback UI when imageUrl is empty/null */
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                      <svg
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-center text-xs text-gray-400 mt-1">
                        {t("noPhoto")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Infrastructure
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {selectedFeature.nom}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {t("dateConstruction")}
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {selectedFeature.date_construction}
                  </p>
                </div>
                {/* <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {t("capacity")}
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {selectedFeature.maxCapacity}
                  </p>
                </div> */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 tracking-wider font-semibold">
                    {t("lastUpdated")}
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {formatDate(selectedFeature.date)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 mb-1 tracking-wider font-semibold">
                    {t("infrastructureState")}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold whitespace-nowrap ${
                      selectedFeature.etat === "bon"
                        ? "bg-green-100 text-green-700"
                        : selectedFeature.etat === "moyen"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedFeature.etat}
                  </span>
                </div>
              </div>

              {/* Graph */}
              <div className="w-full sm:w-auto flex flex-col justify-between items-center gap-3">
                <div className="w-full sm:w-auto flex justify-center items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <CylinderGraph
                    current={selectedFeature.maxCapacity}
                    // max={selectedFeature.maxCapacity}
                  />
                </div>
                <div className="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 tracking-wider font-semibold">
                    {t("funder")}
                  </p>
                  {/*show the logo or the name of the funder*/}
                  {logoUrl ? (
                    <div className="relative w-full h-16 overflow-hidden">
                      <Image
                        src={logoUrl}
                        alt={finalNom}
                        fill
                        /* object-contain est essentiel pour les logos */
                        className="object-contain"
                        sizes="100px"
                      />
                    </div>
                  ) : (
                    <p className="font-medium text-gray-800 text-sm mt-1">
                      {finalNom}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <svg
              className="w-10 h-10 mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm font-medium">{t("selectMarker")}</p>
          </div>
        )}
      </div>

      {/*Modal div to display the images */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 p-4 rounded-md">
          {/* Close Button */}
          <button
            aria-label="Close"
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 bg-black/20 p-2 rounded-full"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Left Button (Only if multiple images) */}
          {images.length > 1 && (
            <button
              aria-label="Go to previous image"
              type="button"
              onClick={handlePrev}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Large Image Container */}
          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <CldImage
              src={images[currentIndex]}
              alt={`${selectedFeature?.nom} - ${currentIndex + 1}`}
              width="800"
              height="600"
              crop="fill"
              gravity="auto"
              className="object-contain rounded-md" // Keeps image in perspective
              // priority
            />
          </div>

          {/* Right Button (Only if multiple images) */}
          {images.length > 1 && (
            <button
              aria-label="Go to next image"
              type="button"
              onClick={handleNext}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Pagination dots or counter */}
          {images.length > 1 && (
            <div className="absolute bottom-10 text-white font-medium bg-black/40 px-4 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
