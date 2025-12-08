import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

export default function Sobre() {
  const router = useRouter();
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  return (
    <View style={[styles.safe, { backgroundColor: cores.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
  <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24 * fontScale} color={cores.primary} />
          <Text style={[styles.backText, { fontSize: 17 * fontScale, color: cores.primary }]}>{t('voltar')}</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: cores.primary }]}>
            <Ionicons name="eye" size={32 * fontScale} color="#fff" />
          </View>
          <Text style={[styles.title, { fontSize: 24 * fontScale, color: cores.text }]}>{t('sobre_o')} <Text style={[styles.logoEye, { fontSize: 24 * fontScale, color: cores.primary }]}>Eye</Text><Text style={[styles.logoSsistant, { fontSize: 24 * fontScale, color: cores.text }]}>ssistant</Text></Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('sobre_o_que_e')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('sobre_o_que_e_body')}</Text>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('sobre_como_funciona')}</Text>
        <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.primary }]}>
          <Ionicons name="camera-outline" size={28 * fontScale} color={cores.primary} style={styles.cardIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('sobre_analise_imagem')}</Text>
            <Text style={[styles.cardDesc, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('sobre_analise_imagem_body')}</Text>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.primary }]}>
          <FontAwesome5 name="brain" size={26 * fontScale} color={cores.primary} style={styles.cardIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('sobre_inteligencia_artificial')}</Text>
            <Text style={[styles.cardDesc, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('sobre_inteligencia_body')}</Text>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.primary }]}>
          <FontAwesome5 name="shield-alt" size={24 * fontScale} color={cores.primary} style={styles.cardIcon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('sobre_privacidade')}</Text>
            <Text style={[styles.cardDesc, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('sobre_privacidade_body')}</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: cores.surface }]} />
        <Text style={[styles.sectionTitle, { fontSize: 17 * fontScale, color: cores.text }]}>{t('sobre_por_que_usar')}</Text>
        <Text style={[styles.text, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('sobre_por_que_usar_body')}</Text>
        <View style={[styles.infoBox, { backgroundColor: cores.surface, borderLeftColor: cores.primary }]}>
          <Text style={[styles.infoText, { fontSize: 14 * fontScale, color: cores.text }]}>{t('sobre_disclaimer')}</Text>
        </View>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scrollContainer: { paddingBottom: 32, paddingHorizontal: 18 },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 24,
    },
    backText: { color: "transparent", fontFamily: "Inter_700Bold", fontSize: 17, marginLeft: 4, flexWrap: 'wrap' },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "center" },
    iconCircle: { backgroundColor: "transparent", width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", marginRight: 12 },
    title: { fontFamily: "Inter_700Bold", fontSize: 24, color: "transparent", flexWrap: 'wrap' },
    logoEye: { color: "transparent", fontFamily: "Inter_700Bold", fontSize: 24, flexWrap: 'wrap' },
    logoSsistant: { color: "transparent", fontFamily: "Inter_700Bold", fontSize: 24, flexWrap: 'wrap' },
    divider: {
      height: 2,
      backgroundColor: "transparent",
      marginVertical: 14,
      borderRadius: 2,
    },
    sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: "transparent", marginTop: 8, marginBottom: 6, flexWrap: 'wrap' },
    text: { fontFamily: "Inter_400Regular", fontSize: 15, color: "transparent", marginBottom: 4, lineHeight: 22, flexWrap: 'wrap' },
    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: "transparent",
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "transparent",
      padding: 14,
      marginBottom: 12,
      gap: 12,
      shadowColor: "#00A86B22",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    cardIcon: { marginRight: 10, marginTop: 2 },
    cardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: "transparent", marginBottom: 2, flexWrap: 'wrap' },
    cardDesc: { fontFamily: "Inter_400Regular", fontSize: 14, color: "transparent", flexWrap: 'wrap' },
    infoBox: { backgroundColor: "transparent", borderLeftWidth: 5, borderLeftColor: "transparent", padding: 12, marginVertical: 14, borderRadius: 8 },
    infoText: { fontFamily: "Inter_400Regular", fontSize: 14, color: "transparent", flexWrap: 'wrap' },
  });
