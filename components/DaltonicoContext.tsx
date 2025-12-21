import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DaltonicoContextProps {
  daltonico: boolean;
  setDaltonico: (v: boolean) => void;
}

const DaltonicoContext = createContext<DaltonicoContextProps>({ daltonico: false, setDaltonico: () => {} });

export const DaltonicoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [daltonico, setDaltonicoState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('eyessistant_daltonico')
      .then(val => {
        if (val !== null) setDaltonicoState(val === 'true');
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const setDaltonico = (v: boolean) => {
    setDaltonicoState(v);
    AsyncStorage.setItem('eyessistant_daltonico', v.toString()).catch(() => {});
  };

  if (!loaded) return null;

  return (
    <DaltonicoContext.Provider value={{ daltonico, setDaltonico }}>
      {children}
    </DaltonicoContext.Provider>
  );
};

export const useDaltonico = () => useContext(DaltonicoContext);
