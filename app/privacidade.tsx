import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

export default function Privacidade() {
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
          <Ionicons name="shield-checkmark-outline" size={32 * fontScale} color={cores.primary} />
          <Text style={[styles.title, { fontSize: 24 * fontScale, color: cores.primary }]}>{t('priv_politica_titulo')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.update, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('priv_ultima_atualizacao')}</Text>

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_1_introducao_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_1_introducao_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_2_informacoes_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_2_informacoes_body')}</Text>
        <View style={[styles.infoBox, { backgroundColor: cores.surface, borderLeftColor: cores.primary }]}>
          <Text style={[styles.infoText, { fontSize: 14 * fontScale, color: cores.text }]}>{t('priv_importante')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_3_uso_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_3_uso_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_4_compartilhamento_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_4_compartilhamento_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_5_seguranca_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_5_seguranca_body')}</Text>
        <View style={[styles.infoBox, { backgroundColor: cores.surface, borderLeftColor: cores.primary }]}>
          <Text style={[styles.infoText, { fontSize: 14 * fontScale, color: cores.text }]}>{t('priv_dica')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_6_direitos_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_6_direitos_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_7_retencao_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_7_retencao_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_8_criancas_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_8_criancas_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_9_alteracoes_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_9_alteracoes_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />

        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('priv_10_contato_titulo')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('priv_10_contato_body')}</Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: cores.primary }]}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Text style={[styles.btnText, { fontSize: 16 * fontScale }]}>{t('priv_btn_entendi')}</Text>
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