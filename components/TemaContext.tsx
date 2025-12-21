import React, { createContext, useContext, useState, useMemo } from 'react';
import { useDaltonico } from './DaltonicoContext';
import { useContraste } from './ContrasteContext';

export type TemaType = 'claro' | 'escuro';

interface TemaContextProps {
  tema: TemaType;
  setTema: (t: TemaType) => void;
}

interface CoresType {
  background: string;
  surface: string;
  text: string;
  textSecundario: string;
  primary: string;
  primaryDark: string;
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  disabled: string;
  cardBg: string;
}

const TemaContext = createContext<TemaContextProps>({ tema: 'claro', setTema: () => {} });
const CoresContext = createContext<CoresType | null>(null);

export const TemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<TemaType>('claro');
  const { daltonico } = useDaltonico();
  const { contraste } = useContraste();

  const cores = useMemo(() => {
    const base = getCoresTema(tema);
    if (contraste) {
      // Paleta alto contraste para nativo e web
      return {
        ...base,
        background: '#000000',
        surface: '#000000',
        text: '#FFFFFF',
        textSecundario: '#FFFFFF',
        primary: '#FFD600',
        primaryDark: '#FFC400',
        border: '#FFFFFF',
        shadow: '#00000099',
        success: '#00FF8A',
        warning: '#FFD600',
        error: '#FF6B6B',
        disabled: '#555',
        cardBg: '#000000',
      } as CoresType;
    }

    if (daltonico) {
      // Paleta neutra para daltônico (evita depender de matiz)
      return {
        ...base,
        background: '#F2F4F5',
        surface: '#FFFFFF',
        text: '#1C1C1E',
        textSecundario: '#3A3A3C',
        primary: '#4A4A4A',
        primaryDark: '#2E2E2E',
        border: '#B0B0B0',
        shadow: '#00000033',
        success: '#4A4A4A',
        warning: '#6E6E6E',
        error: '#8A8A8A',
        disabled: '#C7C7C7',
        cardBg: '#FFFFFF',
      } as CoresType;
    }

    return base;
  }, [tema, daltonico, contraste]);

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      <CoresContext.Provider value={cores}>
        {children}
      </CoresContext.Provider>
    </TemaContext.Provider>
  );
};

export const useTema = () => useContext(TemaContext);
export const useCores = () => {
  const cores = useContext(CoresContext);
  if (!cores) {
    throw new Error('useCores deve ser usado dentro de TemaProvider');
  }
  return cores;
};

// Paleta de cores para tema claro
export const coresClaras: CoresType = {
  background: '#E6FFF5',
  surface: '#fff',
  text: '#00C47D',            // Verde primário (como era antes)
  textSecundario: '#3D6656',
  primary: '#00C47D',
  primaryDark: '#00895C',
  border: '#00A86B',
  shadow: '#00A86B33',
  success: '#00C47D',
  warning: '#FFD600',
  error: '#E53935',
  disabled: '#ccc',
  cardBg: '#fff',
};

// Paleta de cores para tema escuro (verde escuro + preto)
export const coresEscuras: CoresType = {
  background: '#0a0a0a',      // Preto puro
  surface: '#1a1a1a',          // Preto muito escuro
  text: '#e6f7f1',             // Branco esverdeado (quase branco)
  textSecundario: '#a0c4b5',   // Verde claro suave
  primary: '#2d9d6e',          // Verde médio escuro
  primaryDark: '#1a5a3d',      // Verde escuro
  border: '#2d7a56',           // Verde escuro para bordas
  shadow: '#00000055',         // Sombra preta
  success: '#3da573',          // Verde sucesso escuro
  warning: '#ffb800',          // Amarelo mais quente para escuro
  error: '#ff6b6b',            // Vermelho mais claro para escuro
  disabled: '#333',            // Cinza escuro
  cardBg: '#1a1a1a',           // Preto muito escuro para cards
};

export const getCoresTema = (tema: TemaType): CoresType => {
  return tema === 'claro' ? coresClaras : coresEscuras;
};
