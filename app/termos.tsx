import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

export default function Termos() {
  const router = useRouter();
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  return (
    <View style={[styles.safe, { backgroundColor: cores.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24 * fontScale} color={cores.primary} style={{ marginRight: 2, transform: [{ scale: 1.1 * fontScale }] }} />
          <Text style={[styles.backText, { fontSize: 17 * fontScale, color: cores.primary }]}>{t('voltar')}</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={32 * fontScale} color={cores.primary} />
          <Text style={[styles.title, { fontSize: 24 * fontScale, color: cores.primary }]}>{t('termos_titulo')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.update, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('termos_ultima_atualizacao')}</Text>
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_1_aceitacao_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_1_aceitacao_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_2_descripcion_titulo') || t('termos_2_descricao_titulo') || t('termos_2_descricao_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_2_descricao_body')}</Text>
        <View style={[styles.infoBox, { backgroundColor: cores.surface, borderLeftColor: cores.primary }]}>
          <Text style={[styles.infoText, { fontSize: 14 * fontScale, color: cores.text }]}>{t('termos_importante')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_3_elegibilidade_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_3_elegibilidade_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_4_uso_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_4_uso_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_5_limitacao_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_5_limitacao_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_6_propriedade_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_6_propriedade_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_7_modificacoes_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_7_modificacoes_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_8_lei_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_8_lei_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('termos_9_contato_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('termos_9_contato_body')}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: cores.primary }]}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Text style={[styles.btnText, { fontSize: 16 * fontScale }]}>{t('termos_entendi_concordo')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  container: { paddingBottom: 32, paddingHorizontal: 18 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 24,
  },
  backText: { color: "transparent", fontFamily: "Inter_700Bold", fontSize: 17, marginLeft: 4, flexWrap: 'wrap' },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 24, color: "transparent", flexWrap: 'wrap' },
  divider: {
    height: 2,
    backgroundColor: "transparent",
    marginVertical: 14,
    borderRadius: 2,
  },
  update: { fontFamily: "Inter_400Regular", fontSize: 14, color: "transparent", marginBottom: 12, flexWrap: 'wrap' },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: "transparent", marginTop: 8, marginBottom: 6, flexWrap: 'wrap' },
  text: { fontFamily: "Inter_400Regular", fontSize: 15, color: "transparent", marginBottom: 4, lineHeight: 22, flexWrap: 'wrap' },
  infoBox: { backgroundColor: "transparent", borderLeftWidth: 5, borderLeftColor: "transparent", padding: 12, marginVertical: 14, borderRadius: 8 },
  infoText: { fontFamily: "Inter_400Regular", fontSize: 14, color: "transparent", flexWrap: 'wrap' },
  btn: { backgroundColor: "transparent", borderRadius: 10, paddingVertical: 16, alignItems: "center", marginTop: 28, marginBottom: 12, elevation: 2 },
  btnText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16, flexWrap: 'wrap' },
});