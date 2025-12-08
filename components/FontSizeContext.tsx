import React, { createContext, ReactNode, useContext, useState } from "react";

export type FontSizeKey = "A" | "AA" | "AAA";

const fontSizes = {
  A: 0.80,   // Pequena (bem menor)
  AA: 1,     // Normal
  AAA: 1.35, // Grande (bem maior)
};

interface FontSizeContextProps {
  fontSizeKey: FontSizeKey;
  setFontSizeKey: (key: FontSizeKey) => void;
  fontScale: number;
}

const FontSizeContext = createContext<FontSizeContextProps | undefined>(undefined);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSizeKey, setFontSizeKey] = useState<FontSizeKey>("AA");
  const fontScale = fontSizes[fontSizeKey];
  return (
    <FontSizeContext.Provider value={{ fontSizeKey, setFontSizeKey, fontScale }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
