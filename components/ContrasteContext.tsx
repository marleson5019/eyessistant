import React, { createContext, useContext, useState } from 'react';

interface ContrasteContextProps {
  contraste: boolean;
  setContraste: (v: boolean) => void;
}

const ContrasteContext = createContext<ContrasteContextProps>({ contraste: false, setContraste: () => {} });

export const ContrasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contraste, setContraste] = useState(false);
  return (
    <ContrasteContext.Provider value={{ contraste, setContraste }}>
      {children}
    </ContrasteContext.Provider>
  );
};

export const useContraste = () => useContext(ContrasteContext);
