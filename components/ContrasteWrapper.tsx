import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useContraste } from './ContrasteContext';

export const ContrasteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { contraste } = useContraste();
  
  // Quando contraste é true, aplica filtro de alto contraste
  // Quando é false, apenas renderiza normalmente
  return (
    <View style={contraste ? styles.altContrast : styles.normal}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  normal: {
    flex: 1,
  },
  altContrast: {
    flex: 1,
    // Para web, usa filter contrast + brightness
    // Para mobile, aplicaremos efeitos via props de View
    ...(Platform.OS === 'web' ? { 
      filter: 'contrast(1.5) brightness(1.1)',
      // Alternativa mais forte: invert(0.2) hue-rotate(180deg)
    } : {}),
  },
});
