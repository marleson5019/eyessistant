import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";


export default function HomeScreen() {
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* HEADER FIXO */}
      <View style={[styles.headerFixed, { backgroundColor: cores.background, shadowColor: cores.shadow }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: cores.primary }]}>
              <Ionicons name="eye-outline" size={28} color={cores.surface} />
            </View>
            <Text style={[styles.logoText, { fontSize: 22 * fontScale }]}> 
              <Text style={[styles.logoOlh, { fontSize: 22 * fontScale, color: cores.primary }]}>Eyes</Text>
              <Text style={[styles.logoAI, { fontSize: 22 * fontScale, color: cores.primary }]}>sistant</Text>
            </Text>
          </View>
          <Ionicons name="notifications-outline" size={26} color={cores.primary} />
        </View>
      </View>


      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 160 }}
      >
        <View style={styles.container}>
          <Text style={[styles.welcome, { fontSize: 20 * fontScale, color: cores.text }]}>{t('inicio_ola_bemvindo')}</Text>
          <Text style={[styles.subtitle, { fontSize: 15 * fontScale, color: cores.text }]}>{t('inicio_subtitulo')}</Text>

          {/* Botão de Análise */}
          <TouchableOpacity style={[styles.triagemBtn, { backgroundColor: cores.primary }]} onPress={() => { setActiveTab("scan"); router.push("/analise"); }}>
            <View style={[styles.triagemCameraCircle, { backgroundColor: cores.primary }]}>
              <Ionicons name="camera-outline" size={40} color={cores.surface} />
            </View>
            <Text style={[styles.triagemTitle, { fontSize: 16 * fontScale, color: cores.surface }]}>{t('inicio_iniciar_analise')}</Text>
            <Text style={[styles.triagemDesc, { fontSize: 13 * fontScale, color: cores.surface }]}>{t('inicio_analise_rapida')}</Text>
          </TouchableOpacity>

          {/* Tutorial (clickável) */}
          <TouchableOpacity style={[styles.tutorialCard, { backgroundColor: cores.surface }]} onPress={() => { router.push("/tutorial"); }}>
            <View style={[styles.tutorialIconCircleBig, { backgroundColor: cores.background }]}>
              <Ionicons name="book-outline" size={24} color={cores.primary} />
            </View>
            <View>
              <Text style={[styles.tutorialTitle, { fontSize: 15 * fontScale, color: cores.primary }]}>{t('tutorial_titulo')}</Text>
              <Text style={[styles.tutorialDesc, { fontSize: 13 * fontScale, color: cores.text }]}>{t('tutorial_desc')}</Text>
            </View>
          </TouchableOpacity>

          {/* Última análise */}
          <View style={[styles.lastAnalysisCard, { backgroundColor: cores.surface }]}>
            <View style={styles.analysisIconColVertical}>
              <View style={[styles.historyIconCircleSuccess, { backgroundColor: cores.primary }]}>
                <Ionicons name="checkmark" size={16} color={cores.surface} />
              </View>
            </View>
            <View>
              <Text style={[styles.lastAnalysisTitle, { fontSize: 15 * fontScale, color: cores.primary }]}>{t('inicio_ultima_analise')}</Text>
              <Text style={[styles.lastAnalysisDate, { fontSize: 13 * fontScale, color: cores.text }]}>12/05/2024</Text>
              <Text style={[styles.lastAnalysisResult, { fontSize: 14 * fontScale, color: cores.primary }]}>{t('historico_nenhum_sinal')}</Text>
            </View>
          </View>

          {/* Histórico */}
          <View style={styles.sectionRow}>
            <Ionicons name="calendar-outline" size={18} color={cores.primary} />
            <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('historico')}</Text>
            <Text style={[styles.sectionLink, { fontSize: 14 * fontScale, color: cores.primary }]}>{t('inicio_ver_todos')}</Text>
          </View>

          <View style={[styles.historyCard, styles.historyCardSuccess, { backgroundColor: cores.surface }]}>
            <View style={styles.historyIconCol}>
              <View style={[styles.historyIconCircleSuccess, { backgroundColor: cores.primary }]}>
                <Ionicons name="checkmark" size={14} color={cores.surface} />
              </View>
            </View>
            <View>
              <Text style={[styles.historyTitle, { fontSize: 14 * fontScale, color: cores.primary }]}>{t('historico_nenhum_sinal')}</Text>
              <Text style={[styles.historyDate, { fontSize: 12 * fontScale, color: cores.text }]}>12/05/2024</Text>
            </View>
          </View>

          <View style={[styles.historyCard, styles.historyCardWarning, { backgroundColor: cores.surface }]}>
            <View style={styles.historyIconCol}>
              <View style={[styles.historyIconCircleWarning, { backgroundColor: '#FFD600' }]}>
                <Ionicons name="alert" size={14} color={cores.surface} />
              </View>
            </View>
            <View>
              <Text style={[styles.historyTitle, { fontSize: 14 * fontScale, color: cores.primary }]}>{t('historico_possiveis_sinais')}</Text>
              <Text style={[styles.historyDate, { color: cores.text }]}>25/04/2024</Text>
            </View>
          </View>

          {/* Dica de saúde */}
          <View style={[styles.tipCard, { backgroundColor: cores.surface }]}>
            <View style={[styles.tipIconCircle, { backgroundColor: cores.background }]}>
              <Ionicons name="information-circle-outline" size={20} color={cores.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: cores.primary }]}>{t('dica_saude_titulo')}</Text>
              <Text style={[styles.tipText, { color: cores.text }]}>{t('dica_saude_body')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};


function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const router = useRouter();
  const cores = useCores();
  const { t } = useIdioma();
  // Ordem dos tabs e seus dados
  const tabs = [
    { key: "home", icon: "home-outline", label: t('nav_inicio'), route: "/inicio" as "/inicio" },
    { key: "scan", icon: "camera-outline", label: t('nav_analise'), route: "/analise" as "/analise" },
    { key: "dados", icon: "bar-chart-outline", label: t('nav_dados'), route: "/dados" as "/dados" },
    { key: "profile", icon: "person-outline", label: t('nav_perfil'), route: "/perfil" as "/perfil" },
    { key: "settings", icon: "settings-outline", label: t('nav_config'), route: "/config" as "/config" },
  ];
  // Centralizar a aba ativa, distribuir as demais igualmente
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
  const tabsWithoutActive = tabs.filter(tab => tab.key !== activeTab);
  // Distribuição igual considerando o espaço da bolinha central
  const iconCount = tabsWithoutActive.length;
  const gap = 24; // espaçamento entre ícones
  const iconWidth = 40; // largura estimada de cada ícone
  const totalWidth = iconCount * iconWidth + (iconCount - 1) * gap + 70; // 70 = largura da bolinha central

  return (
    <View style={navbarStyles.navbarWrapper}>
      <View style={[navbarStyles.navbar, { justifyContent: 'space-between', width: totalWidth, backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
        {tabsWithoutActive.slice(0, 2).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={navbarStyles.navItem}
            onPress={() => {
              setActiveTab(tab.key);
              router.push(tab.route);
            }}
          >
            <Ionicons
              name={tab.icon as any}
              size={26}
              color={cores.textSecundario}
            />
          </TouchableOpacity>
        ))}
        <View style={{ width: 70 }} />
        {tabsWithoutActive.slice(2).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={navbarStyles.navItem}
            onPress={() => {
              setActiveTab(tab.key);
              router.push(tab.route);
            }}
          >
            <Ionicons
              name={tab.icon as any}
              size={26}
              color={cores.textSecundario}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Botão central elevado com o ícone da aba ativa */}
      <TouchableOpacity
        style={[navbarStyles.centerButton, { backgroundColor: cores.primary, shadowColor: cores.shadow }]}
        onPress={() => {
          setActiveTab(tabs[activeIndex].key);
          router.push(tabs[activeIndex].route);
        }}
      >
        <Ionicons name={tabs[activeIndex].icon as any} size={28} color={cores.surface} />
      </TouchableOpacity>
    </View>
  );
}

const navbarStyles = StyleSheet.create({
  navbarWrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? 36 : 28,
    backgroundColor: "transparent",
  },
  navbar: {
    width: "92%",
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    position: "absolute",
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
});
const styles = StyleSheet.create({
  safe: { flex: 1 }, // cor vem via inline
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 26, fontWeight: "700", marginLeft: 12, flexWrap: 'wrap' },
  logoOlh: { color: "transparent", fontWeight: "700", flexWrap: 'wrap' },
  logoAI: { color: "transparent", fontWeight: "700", flexWrap: 'wrap' },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: "transparent",
    marginBottom: 4,
    flexWrap: 'wrap'
  },
  subtitle: { fontSize: 16, color: "rgba(0,137,92,0.8)", marginBottom: 20, flexWrap: 'wrap' },
  container: { paddingHorizontal: 22 },
  triagemBtn: {
    backgroundColor: "transparent",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    marginBottom: 28,
  },
  triagemCameraCircle: {
    backgroundColor: "transparent",
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  triagemTitle: { color: "transparent", fontSize: 20, fontWeight: "700", flexWrap: 'wrap' },
  triagemDesc: { color: "transparent", fontSize: 15, textAlign: "center", flexWrap: 'wrap' },
  tutorialCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  tutorialIconCircleBig: {
    backgroundColor: "rgba(0,196,125,0.10)",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  tutorialTitle: { fontSize: 16, fontWeight: "700", color: "transparent", flexWrap: 'wrap' },
  tutorialDesc: { fontSize: 14, color: "transparent", flexWrap: 'wrap' },
  lastAnalysisCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
  },
  analysisIconColVertical: { marginRight: 14 },
  lastAnalysisTitle: { fontSize: 16, fontWeight: "700", color: "transparent", flexWrap: 'wrap' },
  lastAnalysisDate: { fontSize: 14, color: "transparent", flexWrap: 'wrap' },
  lastAnalysisResult: { fontSize: 15, fontWeight: "700", color: "transparent", flexWrap: 'wrap' },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "transparent", flexWrap: 'wrap' },
  sectionLink: { fontSize: 14, fontWeight: "700", color: "transparent", marginLeft: "auto", flexWrap: 'wrap' },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  historyCardSuccess: { borderLeftWidth: 4, borderLeftColor: "transparent" },
  historyCardWarning: { borderLeftWidth: 4, borderLeftColor: "transparent" },
  historyIconCol: { marginRight: 12 },
  historyIconCircleSuccess: {
    backgroundColor: "transparent",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  historyIconCircleWarning: {
    backgroundColor: "transparent",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTitle: { fontSize: 14, fontWeight: "700", color: "transparent" },
  historyDate: { fontSize: 12, color: "transparent" },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  tipIconCircle: {
    backgroundColor: "transparent",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipTitle: { fontSize: 15, fontWeight: "700", color: "transparent", marginBottom: 2 },
  tipText: { fontSize: 14, color: "transparent" },
});
