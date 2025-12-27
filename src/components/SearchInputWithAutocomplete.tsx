import { useAppStore } from "@/store/appStore";
import React, { useEffect, useState } from "react";
import { useInfrastructureByAdresse } from "./hooks/useInfrastructure";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {
  InfrastructureType,
  InfrastructureTypes,
} from "@/types/infrastructure";

const SearchInputWithAutocomplete = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const { setSearchTerms, setSearchResults } = useAppStore();

  const { data, isFetching } = useInfrastructureByAdresse(localSearchTerm);

  useEffect(() => {
    if (localSearchTerm.length === 0) {
      setSearchResults(null);
    } else if (data !== undefined) {
      setSearchResults(data);
      setSearchTerms(localSearchTerm);
    }
  }, [data, setSearchResults, setSearchTerms, localSearchTerm]);

  const showAutocomplete = false;
  // localSearchTerm.length >= 3 && !isFetching && data && data.length > 0;

  // const handleSelectAddress = (address: InfrastructureTypes) => {
  //   setLocalSearchTerm(
  //     address.client.avenue || address.client.quartier || address.client.commune
  //   );
  //   setSearchResults([address]);
  // };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Rechercher adresse ou infrastructure..."
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        className="border border-gray-300 w-full pr-10"
      />
      {isFetching ? (
        <span className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin border-2 border-indigo-500 border-t-transparent rounded-full" />
      ) : (
        <Search className="w-5 h-5 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
      )}

      {/* Liste des suggestions (Autocomplétion) */}
      {/* Vous pouvez créer un composant dédié pour cette liste */}
      {/* {showAutocomplete && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectAddress(item)} // Gérer la sélection
              className="p-2 cursor-pointer hover:bg-gray-100 text-sm border-b"
            >
              {item.client.avenue ||
                item.client.commune ||
                item.client.quartier}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default SearchInputWithAutocomplete;
