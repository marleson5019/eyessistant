
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useFontSize } from '../components/FontSizeContext';

export default function NotFoundScreen() {
  const { fontScale } = useFontSize();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ fontSize: 32 * fontScale, lineHeight: 32 * fontScale }}>Esta tela não existe.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link" style={{ fontSize: 16 * fontScale, lineHeight: 30 * fontScale }}>Ir para a tela inicial!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
