import React, { createContext, useContext, useState } from 'react';

interface DaltonicoContextProps {
  daltonico: boolean;
  setDaltonico: (v: boolean) => void;
}

const DaltonicoContext = createContext<DaltonicoContextProps>({ daltonico: false, setDaltonico: () => {} });

export const DaltonicoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [daltonico, setDaltonico] = useState(false);
  return (
    <DaltonicoContext.Provider value={{ daltonico, setDaltonico }}>
      {children}
    </DaltonicoContext.Provider>
  );
};

export const useDaltonico = () => useContext(DaltonicoContext);
