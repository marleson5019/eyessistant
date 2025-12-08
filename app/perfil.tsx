import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFontSize } from '../components/FontSizeContext';
import { useIdioma } from '../components/IdiomaContext';
import Navbar from '../components/Navbar';
import { useCores } from '../components/TemaContext';


const recentAnalysis = [
  {
    status: 'ok',
    title: 'perfil_nenhum_sinal',
    date: '15/06/2025',
    desc: 'perfil_continuar_monitorando',
    dotColor: '#00C47D',
    titleColor: '#00A86B',
  },
  {
    status: 'alert',
    title: 'perfil_possiveis_sinais',
    date: '13/04/2025',
    desc: 'perfil_recomendamos_acompanhamento',
    dotColor: '#FFD600',
    titleColor: '#FFD600',
  },
  {
    status: 'ok',
    title: 'perfil_nenhum_sinal',
    date: '22/04/2025',
    desc: 'perfil_continuar_monitorando',
    dotColor: '#00C47D',
    titleColor: '#00A86B',
  },
];

const PerfilScreen = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const cardAnim = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      120,
      cardAnim.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 60,
        })
      )
    ).start();
  }, [cardAnim]);
  const [pressedCard, setPressedCard] = useState(-1);
  const [profileName, setProfileName] = useState('Carlos Mendes');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState('carlos.mendes@email.com');

  useEffect(() => {
    (async () => {
      try {
        const storedName = await AsyncStorage.getItem('profileName');
        const storedPhoto = await AsyncStorage.getItem('profilePhoto');
        const storedEmail = await AsyncStorage.getItem('profileEmail');
        if (storedName) setProfileName(storedName);
        if (storedPhoto) setProfilePhoto(storedPhoto);
        if (storedEmail) setProfileEmail(storedEmail);
      } catch (e) {
        // ignore
      }
    })();
  }, []);
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* HEADER */}
      <View style={[styles.headerGradient, { backgroundColor: cores.background, shadowColor: cores.shadow }]}>
        <View style={[styles.headerFixed, { shadowColor: cores.shadow }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoCircle, { backgroundColor: cores.primary }]}>
                <Ionicons name="eye-outline" size={28} color={cores.surface} />
              </View>
              <Text style={[styles.logoText, { fontSize: 22 * fontScale, color: cores.primary }]}>Eyessistant</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={26} color={cores.primary} />
            </TouchableOpacity>
          </View>
          {/* headerRowIcons removido para header padrão */}
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, paddingHorizontal: 8 }}>
        {/* CARD PERFIL */}
        <Animated.View
          style={[
            styles.profileCard,
            styles.cardShadowPop,
            { borderWidth: 1, borderColor: cores.primary, backgroundColor: cores.surface,
              transform: [
                { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: pressedCard === 0 ? 0.97 : 1 },
              ]
            }
          ]}
        >
          <TouchableOpacity onPress={() => router.push('/VisaoDados' as any)} activeOpacity={0.9} style={{ borderRadius: 20 }}>
            <View style={styles.profileRow}>
              <View style={styles.profilePicWrap}>
                <View style={styles.profilePicBorder}>
                  <View style={styles.profilePicInner}>
                    {profilePhoto ? (
                      <Image source={{ uri: profilePhoto }} style={{ width: 54 * fontScale, height: 54 * fontScale, borderRadius: 27 }} />
                    ) : (
                      <Ionicons name="person-circle" size={54 * fontScale} color={cores.primary} />
                    )}
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.profileName, { fontSize: 18 * fontScale, color: cores.primary }]}>{profileName}</Text>
                <Text style={[styles.profileEmail, { fontSize: 14 * fontScale, color: cores.text }]}>{profileEmail}</Text>
              </View>
            </View>
          </TouchableOpacity>
  </Animated.View>

        {/* CARD ÚLTIMA CONSULTA */}
        <Animated.View
          style={[
            styles.sectionCard,
            styles.cardShadowPop,
            { borderWidth: 1, borderColor: cores.primary, backgroundColor: cores.surface,
              transform: [
                { scale: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                { translateY: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: pressedCard === 1 ? 0.97 : 1 },
              ]
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('perfil_ultima_consulta')}</Text>
          <View style={styles.sectionRow}>
            <View style={styles.sectionColLeft}>
              <Text style={[styles.sectionLabel, { fontSize: 13 * fontScale, color: cores.text }]}>{t('perfil_data')}</Text>
              <Text style={[styles.sectionValue, { fontSize: 15 * fontScale, color: cores.primary }]}>10/03/2024</Text>
              <Text style={[styles.sectionLabel, { fontSize: 13 * fontScale, color: cores.text }]}>{t('perfil_medico')}</Text>
              <Text style={[styles.sectionValue, { fontSize: 15 * fontScale, color: cores.primary, fontWeight: 'bold' }]}>Dra. Ana Soares</Text>
            </View>
            <TouchableOpacity style={[styles.ctaButtonModern, { backgroundColor: cores.primary }]}>
              <Ionicons name="calendar-outline" size={18} color={cores.surface} style={{ marginRight: 6 }} />
              <Text style={[styles.ctaButtonText, { fontSize: 15 * fontScale, color: cores.surface }]}>{t('perfil_agendar_consulta')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* CARD ANÁLISES RECENTES */}
        <Animated.View
          style={[
            styles.sectionCard,
            styles.cardShadowPop,
            { borderWidth: 1, borderColor: cores.primary, backgroundColor: cores.surface,
              transform: [
                { scale: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                { translateY: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: pressedCard === 2 ? 0.97 : 1 },
              ]
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('perfil_analises_recentes')}</Text>
          {recentAnalysis.map((item, idx) => (
            <View key={idx} style={styles.analysisItem}>
              <View style={[styles.analysisDot, { backgroundColor: item.dotColor }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.analysisTitle, { color: item.titleColor, fontSize: 15 * fontScale }]}>{t(item.title as any)}</Text>
                <Text style={[styles.analysisDate, { fontSize: 13 * fontScale, color: cores.text }]}>{item.date}</Text>
                <Text style={[styles.analysisDesc, { fontSize: 13 * fontScale, color: cores.text }]}>{t(item.desc as any)}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={[styles.ctaButtonSec, { backgroundColor: cores.background }]}>
            <Text style={[styles.ctaButtonTextSec, { color: cores.primary }]}>{t('historico_completo')}</Text>
            <Ionicons name="chevron-forward" size={18} color={cores.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* CARD MEUS DADOS DE VISÃO */}
        <Animated.View
          style={[
            styles.sectionCard,
            styles.cardShadowPop,
            { borderWidth: 1, borderColor: cores.primary, backgroundColor: cores.surface,
              transform: [
                { scale: cardAnim[3].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                { translateY: cardAnim[3].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: pressedCard === 3 ? 0.97 : 1 },
              ]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.sectionRow}
            onPress={() => router.push('/VisaoDados' as any)}
          >
            <Ionicons name="eye-outline" size={22} color={cores.primary} style={{ marginRight: 10 }} />
            <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale, flex: 1, color: cores.primary }]}>{t('perfil_meus_dados_visao')}</Text>
            <Ionicons name="chevron-forward" size={18} color={cores.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* CARD VERSÃO */}
        <Animated.View
          style={[
            styles.sectionCard,
            styles.cardShadowPop,
            { borderWidth: 1, borderColor: cores.primary, backgroundColor: cores.surface,
              transform: [
                { scale: cardAnim[4].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                { translateY: cardAnim[4].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                { scale: pressedCard === 4 ? 0.97 : 1 },
              ]
            }
          ]}
        >
          <View style={styles.sectionRow}>
            <Ionicons name="eye-outline" size={22} color={cores.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { fontSize: 15 * fontScale, color: cores.primary }]}>Eyessistant</Text>
              <Text style={[styles.analysisDesc, { fontSize: 13 * fontScale, color: cores.text }]}>{t('perfil_versao')} 1.0.0</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      {/* <Navbar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
  <Navbar activeTab="profile" setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 2,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  safe: { flex: 1 },
  headerFixed: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRowIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 2,
    backgroundColor: 'transparent',
  },
  headerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerRowText: {
    fontWeight: '600',
  },
  sectionColLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  analysisDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  analysisTitle: {
    fontWeight: '700',
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
  logoText: { fontSize: 26, fontWeight: "700", marginLeft: 12 },
  logoOlh: { color: "transparent", fontWeight: "700" },
  logoAI: { color: "transparent", fontWeight: "700" },
  notifBtn: { padding: 6, borderRadius: 18 },
  profileCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 4,
    marginBottom: 18,
    marginTop: 8,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  profilePicBorder: {
    padding: 6,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profilePicInner: { borderRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profilePicWrap: {
    width: 62, height: 62, borderRadius: 31, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  profileName: { fontSize: 18, fontWeight: '700', color: 'transparent', flexWrap: 'wrap' },
  profileEmail: { fontSize: 14, color: 'transparent', marginTop: 2, flexWrap: 'wrap' },
  logoutBtn: { padding: 8, borderRadius: 18, backgroundColor: 'transparent', marginLeft: 8 },
  sectionCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardShadowPop: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: 'transparent', marginBottom: 8, flexWrap: 'wrap' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionLabel: { fontSize: 13, color: 'transparent', fontWeight: '600', flexWrap: 'wrap' },
  sectionValue: { fontSize: 15, color: 'transparent', fontWeight: '700', marginBottom: 2, flexWrap: 'wrap' },
  ctaButton: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  ctaButtonModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 10,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  ctaButtonText: { color: "transparent", fontSize: 16, fontWeight: "700" },
  ctaButtonSec: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  ctaButtonTextSec: { color: 'transparent', fontSize: 15, fontWeight: '700' },
  analysisItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  analysisDotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'transparent', marginRight: 10 },
  analysisDotYellow: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'transparent', marginRight: 10 },
  analysisTitleGreen: { fontSize: 15, fontWeight: '700', color: 'transparent' },
  analysisTitleYellow: { fontSize: 15, fontWeight: '700', color: 'transparent' },
  analysisDate: { fontSize: 13, color: 'transparent', marginBottom: 2 },
  analysisDesc: { fontSize: 13, color: 'transparent' },
});

export default PerfilScreen;
