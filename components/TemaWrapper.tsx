import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useCores } from './TemaContext';

export const TemaWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cores = useCores();
  
  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
