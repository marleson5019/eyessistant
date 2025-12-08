import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useDaltonico } from './DaltonicoContext';

export const GrayscaleWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { daltonico } = useDaltonico();
  
  // Quando daltonico é true, aplica o estilo com grayscale
  // Quando é false, apenas renderiza o children normalmente
  return (
    <View style={daltonico ? styles.gray : styles.normal}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  normal: {
    flex: 1,
  },
  gray: {
    flex: 1,
    ...(Platform.OS === 'web' ? { filter: 'grayscale(1)' } : {}),
  },
});
