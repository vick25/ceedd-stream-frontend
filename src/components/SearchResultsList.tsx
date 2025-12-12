import { InfrastructureTypes } from "@/types/infrastructure";
import React from "react";

interface InfrastructureSearch {
  total_volume: number;
}
interface SearchResultProps {
  results: InfrastructureSearch | null;
  searchTerm: string;
}
const SearchResultsList: React.FC<SearchResultProps> = ({
  results,
  searchTerm,
}) => {
  if (!results || results.total_volume === 0) {
    <div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Aucun résultat trouvé
      </h2>
      <p className="text-gray-500">
        La recherche pour **"{searchTerm}"** n'a retourné aucune infrastructure.
      </p>
    </div>;
  }
  console.log({ results });
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">
        Capacite total de citerne installer à :{" "}
        <span className="font-bold text-indigo-600">"{searchTerm}"</span> (
        {results?.total_volume} m3)
      </h2>
    </div>
  );
};

export default SearchResultsList;
