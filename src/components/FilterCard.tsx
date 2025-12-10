// import { CATEGORIES } from '@/lib/constants';
import { MapFeature } from "@/types/types";
import React from "react";
import { CylinderGraph } from "./CylinderGraph";

interface FilterCardProps {
  selectedFeature: MapFeature | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
  availableCategories: string[];
}

export const FilterCard: React.FC<FilterCardProps> = ({
  selectedFeature,
  selectedCategory,
  onCategoryChange,
  onClose,
  availableCategories,
}) => {
  const maxCapacity = selectedFeature?.maxCapacity;
  const volumeActuel = 4000;
  return (
    <div className="h-full flex flex-col p-6">
      {/* Header of Card */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Map Options</h2>
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
      <div className="mb-6">
        <label
          htmlFor="category-select"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Type d'infrastructures
        </label>
        <div className="relative">
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm border cursor-pointer hover:bg-white transition-colors"
          >
            {availableCategories.map((cat: any) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Details Section */}
      <div className="grow mt-2 overflow-y-auto">
        {selectedFeature ? (
          <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800 leading-tight">
                {selectedFeature.type}
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
                    Date de construction
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {selectedFeature.date_construction}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Capacité
                  </p>
                  <p className="font-medium text-gray-800 text-sm mt-1">
                    {selectedFeature.maxCapacity}
                  </p>
                </div>
              </div>

              {/* Graph */}
              <div className="w-full sm:w-auto flex justify-center items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                <CylinderGraph
                  current={volumeActuel}
                  max={selectedFeature.maxCapacity}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
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
            <p className="text-sm font-medium">Select a marker on the map</p>
          </div>
        )}
      </div>
    </div>
  );
};
