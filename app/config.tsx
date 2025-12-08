import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useContraste } from "../components/ContrasteContext";
import { useDaltonico } from "../components/DaltonicoContext";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from '../components/IdiomaContext';
import { useCores, useTema } from "../components/TemaContext";

const borderColor = '#00C47D';
const cardBg = '#fff';
const cardShadow = '#00C47D22';
const cardRadius = 18;

// Navbar styles devem vir antes do componente Navbar
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
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#00A86B33",
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
    backgroundColor: "#00C47D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00A86B55",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
});

// Tipos devem vir antes do componente Navbar
type TabRoute = "/inicio" | "/analise" | "/dados" | "/perfil" | "/config";
type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

// Componente Toggle Animado de Tema (Sol/Lua)
const TemaToggleAnimado: React.FC = () => {
  const { tema, setTema } = useTema();
  const cores = useCores();
  const { t } = useIdioma();
  const rotacao = useRef(new Animated.Value(tema === 'claro' ? 0 : 180)).current;

  const handleToggle = () => {
    const novoTema = tema === 'claro' ? 'escuro' : 'claro';
    setTema(novoTema);
    
    Animated.timing(rotacao, {
      toValue: novoTema === 'claro' ? 0 : 180,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const rotationInterpolate = rotacao.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity 
      onPress={handleToggle}
      style={{
        backgroundColor: tema === 'claro' ? '#FFF3CD' : cores.primaryDark,
        borderRadius: 24,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: tema === 'claro' ? '#FFD600' : cores.primary,
        width: 50,
        height: 50,
      }}
    >
      <Animated.View
        style={{
          transform: [{ rotate: rotationInterpolate }],
        }}
      >
        <Ionicons 
          name={tema === 'claro' ? 'sunny' : 'moon'} 
          size={28} 
          color={tema === 'claro' ? '#FFD600' : cores.text}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Componente Navbar
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
  
  const dynamicNavbarStyles = StyleSheet.create({
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
      backgroundColor: cores.surface,
      borderRadius: 40,
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: cores.shadow,
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
      backgroundColor: cores.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: cores.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8,
    },
  });
  
  return (
    <View style={dynamicNavbarStyles.navbarWrapper}>
      <View style={[dynamicNavbarStyles.navbar, { justifyContent: 'space-between', width: totalWidth }]}> 
        {tabsWithoutActive.slice(0, 2).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={dynamicNavbarStyles.navItem}
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
            style={dynamicNavbarStyles.navItem}
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
        style={dynamicNavbarStyles.centerButton}
        onPress={() => {
          setActiveTab(tabs[activeIndex].key);
          router.push(tabs[activeIndex].route);
        }}
      >
        <Ionicons name={tabs[activeIndex].icon as any} size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Componente ConfigScreen (mantenha todo o código existente do ConfigScreen)
function ConfigScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const { fontSizeKey, setFontSizeKey, fontScale } = useFontSize();
  const { daltonico, setDaltonico: setDaltonicoGlobal } = useDaltonico();
  const { contraste, setContraste: setContrasteGlobal } = useContraste();
  const cores = useCores();
  const { t } = useIdioma();
  const [lembretes, setLembretes] = useState(true);
  const [acompanhamento, setAcompanhamento] = useState(true);

  const animatedValues = useRef(Array.from({ length: 9 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: i * 90,
        useNativeDriver: true,
      })
    );
    Animated.stagger(70, animations).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* HEADER */}
      <View style={{ 
        backgroundColor: cores.surface, 
        borderBottomWidth: 1, 
        borderBottomColor: cores.border, 
        paddingTop: Platform.OS === 'ios' ? 44 : 24, 
        paddingBottom: 8, 
        paddingHorizontal: 0 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingHorizontal: 18 
        }}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ 
              backgroundColor: cores.surface, 
              borderRadius: 22, 
              padding: 8, 
              shadowColor: cores.primary, 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.12, 
              shadowRadius: 6, 
              elevation: 2 
            }}
          >
            <Ionicons name="arrow-back" size={24 * fontScale} color={cores.primary} />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 22 * fontScale, 
            fontWeight: '700', 
            color: cores.text, 
            flex: 1, 
            textAlign: 'center', 
            marginLeft: -32,
            flexWrap: 'wrap'
          }}>
            {t('configuracoes')}
          </Text>
          <Ionicons name="notifications-outline" size={24 * fontScale} color={cores.primary} />
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          paddingTop: 18,
          paddingBottom: 120, // Espaço para a navbar
          paddingHorizontal: 0 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ 
          gap: 18, 
          paddingHorizontal: 12, 
          flexGrow: 1,
          paddingBottom: 120 // Espaço extra para garantir que o último card seja visível
        }}>
          {/* Editar Perfil */}
          <Animated.View
            style={[
              styles.card,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                minHeight: 64 * fontScale,
                opacity: animatedValues[0],
                transform: [{
                  scale: animatedValues[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
            >
            <TouchableOpacity onPress={() => router.push('/edit-profile')} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <View style={[styles.iconCircle, { backgroundColor: `${cores.primary}18`, marginRight: 16 }]}>
              <Ionicons name="person-outline" size={28 * fontScale} color={cores.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text 
                style={{ 
                  fontSize: 17 * fontScale, 
                  fontWeight: '700', 
                  color: cores.text, 
                  flexShrink: 1, 
                  flexWrap: 'wrap' 
                }} 
                numberOfLines={2}
              >
                {t('config_editar_perfil')}
              </Text>
              <Text 
                style={{ 
                  fontSize: 14 * fontScale, 
                  color: cores.textSecundario, 
                  marginTop: 2, 
                  flexShrink: 1, 
                  flexWrap: 'wrap' 
                }} 
                numberOfLines={2}
              >
                {t('config_altere_dados')}
              </Text>
            </View>
              <Ionicons 
                name="chevron-forward" 
                size={22 * fontScale} 
                color={cores.disabled} 
                style={{ flexShrink: 0 }} 
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Tutorial */}
          <Animated.View
            style={[
              styles.card,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                minHeight: 64 * fontScale,
                opacity: animatedValues[1],
                transform: [{
                  scale: animatedValues[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <TouchableOpacity 
              onPress={() => router.push('/tutorial')} 
              style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${cores.primary}18`, marginRight: 16 }]}>
                <Ionicons name="book-outline" size={28 * fontScale} color={cores.primary} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text 
                  style={{ 
                    fontSize: 17 * fontScale, 
                    fontWeight: '700', 
                    color: cores.text, 
                    flexShrink: 1, 
                    flexWrap: 'wrap' 
                  }} 
                  numberOfLines={2}
                >
                  {t('config_tutorial')}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 14 * fontScale, 
                    color: cores.textSecundario, 
                    marginTop: 2, 
                    flexShrink: 1, 
                    flexWrap: 'wrap' 
                  }} 
                  numberOfLines={2}
                >
                  {t('config_aprenda_usar')}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={22 * fontScale} 
                color={cores.disabled} 
                style={{ flexShrink: 0 }} 
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Preferências de Notificações */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                minHeight: 64 * fontScale,
                opacity: animatedValues[2],
                transform: [{
                  scale: animatedValues[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons 
                name="notifications-outline" 
                size={22 * fontScale} 
                color={cores.primary} 
                style={{ marginRight: 8 }} 
              />
              <Text 
                style={{ 
                  fontSize: 16 * fontScale, 
                  fontWeight: '700', 
                  color: cores.text,
                  flexShrink: 1,
                  flexWrap: 'wrap'
                }}
              >
                {t('config_preferencias_notificacoes')}
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text 
                    style={{ 
                      fontSize: 15 * fontScale, 
                      fontWeight: '700', 
                      color: cores.text,
                      flexWrap: 'wrap'
                    }}
                  >
                    {t('config_lembretes')}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 13 * fontScale, 
                      color: cores.textSecundario,
                      flexWrap: 'wrap'
                    }}
                  >
                    {t('config_receba_lembretes')}
                  </Text>
                </View>
                <Switch 
                  value={lembretes} 
                  onValueChange={setLembretes} 
                  trackColor={{ true: cores.primary, false: cores.disabled }} 
                  thumbColor={lembretes ? '#fff' : '#eee'} 
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text 
                    style={{ 
                      fontSize: 15 * fontScale, 
                      fontWeight: '700', 
                      color: cores.text,
                      flexWrap: 'wrap'
                    }}
                  >
                    {t('config_acompanhamento_medico')}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 13 * fontScale, 
                      color: cores.textSecundario,
                      flexWrap: 'wrap'
                    }}
                  >
                    {t('config_notificacoes_consultas')}
                  </Text>
                </View>
                <Switch 
                  value={acompanhamento} 
                  onValueChange={setAcompanhamento} 
                  trackColor={{ true: cores.primary, false: cores.disabled }} 
                  thumbColor={acompanhamento ? '#fff' : '#eee'} 
                />
              </View>
            </View>
          </Animated.View>

          {/* Idioma */}
          <Animated.View
            style={[
              styles.card,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                minHeight: 64 * fontScale,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[3],
                transform: [{
                  scale: animatedValues[3].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <TouchableOpacity onPress={() => router.push('/idioma')} style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View style={[styles.iconCircle, { backgroundColor: `${cores.primary}18`, marginRight: 16, flexShrink: 0 }]}>
                <Ionicons name="language-outline" size={28 * fontScale} color={cores.primary} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text 
                  style={{ 
                    fontSize: 17 * fontScale, 
                    fontWeight: '700', 
                    color: cores.text, 
                    flexShrink: 1, 
                    flexWrap: 'wrap' 
                  }}
                >
                  {t('idioma')}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 14 * fontScale, 
                    color: cores.textSecundario, 
                    marginTop: 2, 
                    flexShrink: 1, 
                    flexWrap: 'wrap' 
                  }}
                >
                  {t('idioma_selecionado')}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={22 * fontScale} 
                color={cores.disabled} 
                style={{ flexShrink: 0 }} 
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Acessibilidade */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[4],
                transform: [{
                  scale: animatedValues[4].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons 
                name="eye-outline" 
                size={22 * fontScale} 
                color={cores.primary} 
                style={{ marginRight: 8 }} 
              />
              <Text 
                style={{ 
                  fontSize: 16 * fontScale, 
                  fontWeight: '700', 
                  color: cores.text,
                  flexShrink: 1,
                  flexWrap: 'wrap'
                }}
              >
                {t('config_acessibilidade')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              {(['A', 'AA', 'AAA'] as const).map(f => (
                <TouchableOpacity
                  key={f}
                  style={{ 
                    flex: 1, 
                    backgroundColor: fontSizeKey === f ? cores.primary : cores.surface, 
                    borderRadius: 8, 
                    borderWidth: 1.5, 
                    borderColor: cores.primary, 
                    paddingVertical: 8, 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                  onPress={() => setFontSizeKey(f)}
                >
                  <Text 
                    style={{ 
                      color: fontSizeKey === f ? '#fff' : cores.text, 
                      fontWeight: '700', 
                      fontSize: 16 * fontScale 
                    }}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text 
                  style={{ 
                    fontSize: 15 * fontScale, 
                    fontWeight: '700', 
                    color: cores.text,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('config_alto_contraste')}
                </Text>
                  <Text 
                  style={{ 
                    fontSize: 13 * fontScale, 
                      color: cores.textSecundario,
                    flexWrap: 'wrap'
                  }}
                >
                    {t('config_aumenta_contraste')}
                </Text>
              </View>
              <Switch 
                value={contraste} 
                onValueChange={setContrasteGlobal} 
                trackColor={{ true: cores.primary, false: cores.disabled }} 
                thumbColor={contraste ? '#fff' : '#eee'} 
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text 
                  style={{ 
                    fontSize: 15 * fontScale, 
                    fontWeight: '700', 
                    color: cores.text,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('config_modo_daltonico')}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 13 * fontScale, 
                    color: cores.textSecundario,
                    flexWrap: 'wrap'
                  }}
                >
                  Converte cores para escala de cinza
                </Text>
              </View>
              <Switch 
                value={daltonico} 
                onValueChange={setDaltonicoGlobal} 
                trackColor={{ true: cores.primary, false: cores.disabled }} 
                thumbColor={daltonico ? '#fff' : '#eee'} 
              />
            </View>
          </Animated.View>

          {/* Tema Escuro/Claro */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[5],
                transform: [{
                  scale: animatedValues[5].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text 
                  style={{ 
                    fontSize: 15 * fontScale, 
                    fontWeight: '700', 
                    color: cores.text,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('config_tema')}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 13 * fontScale, 
                    color: cores.textSecundario,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('config_alternar_claro_escuro')}
                </Text>
              </View>
              <TemaToggleAnimado />
            </View>
          </Animated.View>

          {/* Privacidade e Segurança */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[6],
                transform: [{
                  scale: animatedValues[6].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <Text 
              style={{ 
                fontSize: 16 * fontScale, 
                fontWeight: '700', 
                color: cores.text, 
                marginBottom: 8,
                flexWrap: 'wrap'
              }}
            >
                {t('config_privacidade_seguranca')}
            </Text>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={() => router.push("/privacidade")}
            >
              <Text 
                style={{ 
                  color: cores.text, 
                  fontWeight: '700', 
                  fontSize: 15 * fontScale, 
                  flex: 1,
                  flexWrap: 'wrap'
                }}
              >
                  {t('config_politica_privacidade')}
              </Text>
              <Ionicons name="chevron-forward" size={20 * fontScale} color={cores.disabled} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={() => router.push("/termos")}
            >
              <Text 
                style={{ 
                  color: cores.text, 
                  fontWeight: '700', 
                  fontSize: 15 * fontScale, 
                  flex: 1,
                  flexWrap: 'wrap'
                }}
              >
                  {t('termos_uso')}
              </Text>
              <Ionicons name="chevron-forward" size={20 * fontScale} color={cores.disabled} />
            </TouchableOpacity>
          </Animated.View>

          {/* Ajuda e Sair */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: cores.surface,
                shadowColor: cores.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.10,
                shadowRadius: 10,
                elevation: 3,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[7],
                transform: [{
                  scale: animatedValues[7].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={() => router.push("/sobre")}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${cores.primary}18`, marginRight: 16, flexShrink: 0 }]}>
                <Ionicons name="help-circle-outline" size={26 * fontScale} color={cores.primary} />
              </View>
              <Text 
                style={{ 
                  color: cores.text, 
                  fontWeight: '700', 
                  fontSize: 16 * fontScale, 
                  flex: 1,
                  flexWrap: 'wrap'
                }}
              >
                {t('config_ajuda_sobre')}
              </Text>
              <Ionicons name="chevron-forward" size={22 * fontScale} color={cores.disabled} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={() => router.replace('/')}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${cores.error}18`, marginRight: 16, flexShrink: 0 }]}>
                <Ionicons name="exit-outline" size={26 * fontScale} color={cores.error} />
              </View>
              <Text 
                style={{ 
                  color: cores.error, 
                  fontWeight: '700', 
                  fontSize: 16 * fontScale, 
                  flex: 1,
                  flexWrap: 'wrap'
                }}
              >
                {t('config_sair_conta')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sobre */}
          <Animated.View
            style={[
              styles.card,
              {
                alignItems: 'center',
                paddingVertical: 18,
                marginBottom: 24,
                borderColor: cores.primary,
                borderWidth: 1.5,
                backgroundColor: `${cores.primary}10`,
                maxWidth: '100%',
                flexGrow: 1,
                flexShrink: 1,
                opacity: animatedValues[8],
                transform: [{
                  scale: animatedValues[8].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                }],
              },
            ]}
          >
            <Text 
              style={{ 
                fontSize: 15 * fontScale, 
                fontWeight: '700', 
                color: cores.text, 
                marginBottom: 4,
                flexWrap: 'wrap',
                textAlign: 'center'
              }}
            >
              {t('config_sobre_eyessistant')}
            </Text>
            <Text 
              style={{ 
                color: cores.textSecundario, 
                fontSize: 13 * fontScale, 
                marginBottom: 2,
                flexWrap: 'wrap',
                textAlign: 'center'
              }}
            >
              {t('perfil_versao')} 1.0.0
            </Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
              <TouchableOpacity onPress={() => router.push("/privacidade")}>
                <Text 
                  style={{ 
                    color: cores.text, 
                    fontWeight: '700', 
                    fontSize: 14 * fontScale,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('config_politica_privacidade')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/termos")}>
                <Text 
                  style={{ 
                    color: cores.text, 
                    fontWeight: '700', 
                    fontSize: 14 * fontScale,
                    flexWrap: 'wrap'
                  }}
                >
                  {t('termos_uso')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
  },
  card: {
    borderRadius: cardRadius,
    padding: 18,
    marginBottom: 0,
    flexShrink: 1,
    flexGrow: 1,
  },
  
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConfigScreen;
