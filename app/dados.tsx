import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

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
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
});
type TabRoute = "/inicio" | "/analise" | "/dados" | "/perfil" | "/config";
type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const cores = useCores();
  const { t } = useIdioma();
  const tabs: { key: string; icon: string; label: string; route: TabRoute }[] = [
    { key: "home", icon: "home-outline", label: t('nav_inicio'), route: "/inicio" },
    { key: "scan", icon: "camera-outline", label: t('nav_analise'), route: "/analise" },
    { key: "dados", icon: "bar-chart-outline", label: t('nav_dados'), route: "/dados" },
    { key: "profile", icon: "person-outline", label: t('nav_perfil'), route: "/perfil" },
    { key: "settings", icon: "settings-outline", label: t('nav_config'), route: "/config" },
  ];
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
  const tabsWithoutActive = tabs.filter(tab => tab.key !== activeTab);
  const iconCount = tabsWithoutActive.length;
  const gap = 24;
  const iconWidth = 40;
  const totalWidth = iconCount * iconWidth + (iconCount - 1) * gap + 70;
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
            <Ionicons name={tab.icon as any} size={26} color={cores.textSecundario} />
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
            <Ionicons name={tab.icon as any} size={26} color={cores.textSecundario} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[navbarStyles.centerButton, { backgroundColor: cores.primary }]}
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

function DadosScreen() {
  const [activeTab, setActiveTab] = useState("dados");
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const mesesKeys = ['jan','fev','mar','abr','mai','jun','jul','ago','set'];
  const meses = mesesKeys.map(k => t(k));
  const analisesPorMes = [0, 1, 2, 2, 5, 4, 3, 2, 1];
  const positivos = 5;
  const totalAnalises = analisesPorMes.reduce((a, b) => a + b, 0);
  const negativos = 15;

  // Animations
  const barAnim = useRef(analisesPorMes.map(() => new Animated.Value(0))).current;
  const pieAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Animate bars
    Animated.stagger(80, barAnim.map((anim, i) =>
      Animated.timing(anim, {
        toValue: analisesPorMes[i],
        duration: 700,
        useNativeDriver: false,
        easing: Easing.out(Easing.exp),
      })
    )).start();
    // Animate pie
    Animated.timing(pieAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  // Card press animation
  const [pressedCard, setPressedCard] = useState(-1);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* HEADER */}
      <View style={[styles.headerFixed, { backgroundColor: cores.background, borderBottomColor: cores.surface, shadowColor: cores.shadow }]}>
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 100, paddingBottom: 210 }}>
  <Text style={[styles.dashTitle, { fontSize: 18 * fontScale, color: cores.primary }]}>{t('dados_titulo')}</Text>
        {/* CARDS RESUMO */}
        <View style={styles.cardsRowWrap}>
          {[{
            icon: "analytics-outline", color: "#00C47D", bg: "#00C47D22", value: totalAnalises, label: t('dados_total_analises'), deco: null
          }, {
            icon: "checkmark-circle-outline", color: "#00A86B", bg: "#00A86B22", value: negativos, label: t('dados_normais'), deco: { icon: "leaf-outline", pos: { bottom: 8, left: 8 } }
          }, {
            icon: "alert-circle-outline", color: "#FFD600", bg: "#FFD60022", value: positivos, label: t('dados_sinais_catarata'), deco: { icon: "alert", pos: { bottom: 8, right: 8 } }
          }].map((card, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.card,
                styles.cardShadow,
                styles.cardEnfeite,
                { backgroundColor: card.bg, transform: [{ scale: pressedCard === idx ? 0.96 : 1 }] },
                { shadowColor: card.color, shadowOpacity: 0.22, shadowRadius: 18, elevation: 12 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'center', width: '100%' }}
                onPressIn={() => setPressedCard(idx)}
                onPressOut={() => setPressedCard(-1)}
              >
                <Ionicons name={card.icon as any} size={32 * fontScale} color={card.color} style={{ marginBottom: 6, textShadowColor: card.color + '99', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } }} />
                <Text style={[styles.cardValue, { fontSize: 18 * fontScale }]}>{card.value}</Text>
                <Text style={[styles.cardLabel, { fontSize: 13 * fontScale }]}>{card.label}</Text>
                {card.deco && <Ionicons name={card.deco.icon as any} size={16} color={card.color} style={{ position: 'absolute', opacity: 0.18, ...card.deco.pos }} />}
                {/* Gradiente/Brilho fake */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: cores.surface, opacity: 0.13 }} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        {/* GRÁFICO DE BARRAS ANIMADO */}
        <View style={styles.graphCardWrap}>
            <View style={[styles.graphCard, { minHeight: 180, paddingTop: 48, paddingBottom: 24, justifyContent: 'flex-start', backgroundColor: cores.surface, borderWidth: 0, shadowColor: cores.shadow, shadowOpacity: 0.18, shadowRadius: 18, elevation: 10 }]}> 
            <Text style={[styles.graphTitle, { marginBottom: 28, fontSize: 15 * fontScale, color: cores.text }]}>{t('analises_por_mes')}</Text>
            <View style={styles.barGraphRowMultiCol}>
              {analisesPorMes.map((val, i) => (
                <View key={i} style={styles.barColMulti}>
                  <Animated.View style={[
                    styles.bar,
                    {
                      height: barAnim[i].interpolate({ inputRange: [0, 6], outputRange: [10, 10 + 6 * 12] }),
                      backgroundColor: val > 0 ? (i === 4 && positivos > 0 ? '#FFD600' : '#00C47D') : '#E6F7F1',
                      // Novo efeito: degradê escuro na base
                      shadowColor: val > 0 ? (i === 4 && positivos > 0 ? '#B89B00' : '#00895C') : '#E6F7F1',
                      shadowOpacity: 0.32,
                      shadowRadius: 16,
                      elevation: 10,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 22,
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 8,
                      marginBottom: 2,
                    },
                  ]} />
                  <Text style={[styles.barLabel, { fontSize: 12 * fontScale, color: cores.textSecundario }]}>{meses[i]}</Text>
                  {/* Removido ícone/bolinha amarela da barra de Maio */}
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* GRÁFICO DE BARRAS HORIZONTAIS ANIMADO (substitui pizza) */}
        <View style={styles.graphCardWrap}>
          <View style={[styles.graphCard, { backgroundColor: cores.surface, borderWidth: 0, shadowColor: '#FFD600', shadowOpacity: 0.13, shadowRadius: 18, elevation: 10 }]}> 
            <Text style={[styles.graphTitle, { fontSize: 15 * fontScale, color: cores.text }]}>{t('dados_proporcao')}</Text>
            <View style={{ marginTop: 18, marginBottom: 8, width: '100%' }}>
              {[{
                labelKey: 'dados_sinais_catarata', color: '#FFD600', value: positivos
              }, {
                labelKey: 'dados_normais', color: '#00A86B', value: negativos
              }].map((item, idx) => (
                <View key={item.labelKey} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                  <Text style={{ width: 38, fontSize: 13, color: item.color, fontWeight: '700', marginRight: 6 }}>{item.value}</Text>
                  <Animated.View style={{
                    height: 22,
                    borderRadius: 12,
                    backgroundColor: item.color,
                    width: pieAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${Math.round((item.value / totalAnalises) * 100)}%`] }),
                    shadowColor: item.color,
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 6,
                  }} />
                  <Text style={{ marginLeft: 12, fontSize: 15, color: cores.text, fontWeight: '600' }}>{t(item.labelKey)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* CARDS CLICÁVEIS */}
        <Text style={[styles.sectionTitle, { color: cores.primary }]}>{t('acoes_rapidas')}</Text>
        <View style={styles.actionsRowWrap}>
          {[{
            icon: "calendar-outline", color: "#00A86B", label: t('dados_historico_completo'), deco: { icon: "chevron-forward", pos: { bottom: 8, right: 8 } }
          }, {
            icon: "bulb-outline", color: "#00A86B", label: t('dados_dicas_prevencao'), deco: { icon: "sparkles-outline", pos: { top: 8, left: 8 } }
          }, {
            icon: "medkit-outline", color: "#00A86B", label: t('dados_consultar_especialista'), deco: { icon: "chatbubble-ellipses-outline", pos: { top: 8, right: 8 } }
          }].map((card, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.card,
                styles.cardShadow,
                styles.actionCard,
                { backgroundColor: cores.background, transform: [{ scale: pressedCard === idx + 3 ? 0.96 : 1 }] },
                { shadowColor: card.color, shadowOpacity: 0.22, shadowRadius: 18, elevation: 12 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'center', width: '100%' }}
                onPressIn={() => setPressedCard(idx + 3)}
                onPressOut={() => setPressedCard(-1)}
              >
                <Ionicons name={card.icon as any} size={28} color={card.color} style={{ marginBottom: 6, textShadowColor: card.color + '99', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } }} />
                <Text style={[styles.cardLabel, { color: cores.text }]}>{card.label}</Text>
                <Ionicons name={card.deco.icon as any} size={16} color={card.color} style={{ position: 'absolute', opacity: 0.18, ...card.deco.pos }} />
                {/* Gradiente/Brilho fake */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: cores.surface, opacity: 0.13 }} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 26, fontWeight: "700", marginLeft: 12 },
  logoOlh: { fontWeight: "700" },
  logoAI: { fontWeight: "700" },
  dashTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 12,
  },
  cardsRowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 18,
    gap: 10,
    paddingHorizontal: 14,
    flexWrap: 'nowrap',
  },
  card: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
    minHeight: 90,
    maxWidth: 120,
    maxHeight: 120,
    marginHorizontal: 2,
    flexShrink: 1,
  },
  cardEnfeite: {
    overflow: 'visible',
  },
  actionCard: {
    minWidth: 100,
    maxWidth: 140,
    marginBottom: 6,
    marginTop: 2,
  },
  cardShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  // Barras lado a lado para gráfico de colunas
  barGraphRowMultiCol: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
    height: 60,
    marginBottom: 2,
    minWidth: 0,
    paddingHorizontal: 0,
  },
  barColMulti: {
    alignItems: "center",
    justifyContent: 'flex-end',
    minWidth: 10,
    flex: 1,
  },
  graphCard: {
    backgroundColor: "transparent",
    borderRadius: 22,
    padding: 10,
    elevation: 4,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    alignItems: 'center',
    minWidth: 0,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  barScrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 2,
  },
  graphCardWrap: {
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "transparent",
    marginBottom: 12,
  },
  barGraphRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: 18,
    height: 130,
    marginBottom: 2,
    minWidth: 420,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: "center",
    justifyContent: 'flex-end',
    minWidth: 32,
  },
  bar: {
    width: 22,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  barLabel: {
    fontSize: 12,
    color: "transparent",
    fontWeight: "600",
  },
  pieRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  pieChartFake: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pieSlice: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  pieCenter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    position: "absolute",
    top: 23,
    left: 23,
  },
  pieLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  pieLegendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  pieLegendLabel: {
    fontSize: 14,
    color: "transparent",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "transparent",
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionsRowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 18,
    gap: 10,
    paddingHorizontal: 14,
    flexWrap: 'nowrap',
    marginTop: 6,
  },
});

export default DadosScreen;
