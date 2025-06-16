"use client";

import * as React from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError: React.FC<ErrorProps> = ({ error, reset }): React.ReactElement => {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <h2 className="text-2xl font-bold">Algo deu errado!</h2>
      <button onClick={() => reset()} className="underline">
        Tentar novamente
      </button>
    </div>
  );
};

export default GlobalError;
