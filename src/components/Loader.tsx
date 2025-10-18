import React from "react";

interface Props {
  children?: React.ReactNode;
}

function Loader({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800 mb-4"></div>
      <p className="text-gray-600 font-medium">Chargement de données...</p>
      <p className="text-sm text-gray-500 mt-2">{children}</p>
    </div>
  );
}

export default Loader;
