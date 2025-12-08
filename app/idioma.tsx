import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useContraste } from '../components/ContrasteContext';
import { useDaltonico } from '../components/DaltonicoContext';
import { useFontSize } from '../components/FontSizeContext';
import { useIdioma } from '../components/IdiomaContext';
import { useCores } from '../components/TemaContext';

export default function IdiomaScreen() {
  const router = useRouter();
  const cores = useCores();
  const { fontScale } = useFontSize();
  const { daltonico } = useDaltonico();
  const { contraste } = useContraste();
  const { idioma, setIdioma, t } = useIdioma();

  const options = [
    { key: 'pt', label: t('portugues') },
    { key: 'en', label: t('english') },
    { key: 'es', label: t('spanish') },
  ];

  const onSelect = (key: 'pt' | 'en' | 'es') => {
    setIdioma(key);
    // stay on the page — the provider will re-render texts immediately
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}> 
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 44 : 20, backgroundColor: cores.surface, borderBottomColor: cores.border, borderBottomWidth: 1 }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * fontScale} color={cores.primary} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.title, { color: cores.text, fontSize: 20 * fontScale }]}>{t('idioma')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={{ padding: 18 }}>
        <Text style={[styles.info, { color: cores.textSecundario, fontSize: 13 * fontScale }]}>{t('aplicacoes_idioma')}</Text>

        <View style={{ height: 18 }} />

        {options.map((opt) => {
          const active = idioma === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onSelect(opt.key as any)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.langCard,
                {
                  backgroundColor: active ? cores.primary : cores.surface,
                  borderColor: active ? cores.primary : cores.border,
                  shadowColor: cores.shadow,
                },
                contraste ? styles.highContrastCard : {},
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.flagCircle, { backgroundColor: active ? cores.surface : `${cores.primary}10`, borderColor: cores.primary }]}>
                  <Ionicons name="globe-outline" size={22 * fontScale} color={active ? cores.primary : cores.primary} />
                </View>
                <Text style={[styles.langLabel, { color: active ? cores.surface : cores.text, fontSize: 16 * fontScale, marginLeft: 12 }]}>{opt.label}</Text>
              </View>
              {active ? (
                <Ionicons name="checkmark" size={20 * fontScale} color={cores.surface} />
              ) : (
                <Ionicons name="chevron-forward" size={20 * fontScale} color={cores.textSecundario} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 8, borderRadius: 18 },
  title: { fontWeight: '700', textAlign: 'center', flex: 1 },
  info: { textAlign: 'center', marginBottom: 8 },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  flagCircle: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1 },
  langLabel: { fontWeight: '600' },
  highContrastCard: { borderWidth: 2 },
});
