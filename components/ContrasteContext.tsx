import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ContrasteContextProps {
  contraste: boolean;
  setContraste: (v: boolean) => void;
}

const ContrasteContext = createContext<ContrasteContextProps>({ contraste: false, setContraste: () => {} });

export const ContrasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contraste, setContrasteState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('eyessistant_contraste')
      .then(val => {
        if (val !== null) setContrasteState(val === 'true');
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const setContraste = (v: boolean) => {
    setContrasteState(v);
    AsyncStorage.setItem('eyessistant_contraste', v.toString()).catch(() => {});
  };

  if (!loaded) return null;

  return (
    <ContrasteContext.Provider value={{ contraste, setContraste }}>
      {children}
    </ContrasteContext.Provider>
  );
};

export const useContraste = () => useContext(ContrasteContext);
