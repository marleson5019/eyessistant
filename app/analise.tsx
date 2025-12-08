// app/analise.tsx
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import { useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";
import { PredictionResult, getRecommendation, predictWithRetry } from "../services/catarata-api";

// Navbar igual ao início

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

import type { FC } from "react";

// Mover o objeto styles para antes do componente principal
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 20,
    borderRadius: 22,
    padding: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
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
  analiseContainer: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 190,
    paddingHorizontal: 22,
  },
  analiseTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 28,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bigCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  prepTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  prepDesc: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: "center",
  },
  ctaButton: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 38,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  ctaButtonLarge: {
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    width: '100%',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: "700",
  },
  ctaButtonTextLarge: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chooseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
    marginBottom: 12,
  },
  chooseButton: {
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  chooseButtonText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  cameraFullContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  cameraExpanded: {
    width: '95%',
    height: '90%',
    borderRadius: 22,
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 18,
  },
  flashButton: {
    position: 'absolute',
    top: 24,
    right: 20,
    borderRadius: 22,
    padding: 10,
    zIndex: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  captureButton: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    borderRadius: 36,
    padding: 18,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 12,
  },
  cameraPreviewContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cameraPreview: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 22,
    marginBottom: 18,
  },
  cameraBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#00C47D33",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  cameraBoxEnhanced: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: "#00C47D55",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowColor: "#00A86B33",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  cameraCircleDashed: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#00C47D77",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraCircleDashedLarge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#00C47D99",
    borderStyle: "dashed",
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  tipsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    width: "100%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E6F7F1",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00A86B",
  },
  tipItem: {
    fontSize: 14,
    color: "#3D6656",
    marginBottom: 2,
  },
  detailsWrapper: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailsHeaderTitle: { fontSize: 15, fontWeight: '700', flexWrap: 'wrap' },
  detailsContent: {
    overflow: 'hidden',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailCol: { flex: 1, minWidth: 120 },
  detailLabel: { fontSize: 13, flexWrap: 'wrap' },
  detailValue: { fontSize: 14, fontWeight: '700', flexWrap: 'wrap' },
  resultCard: {
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 24, gap: 12 },
  actionBtn: { borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  actionBtnText: { fontWeight: '700', fontSize: 13, marginTop: 4, flexWrap: 'wrap' },
});

type TabRoute = "/inicio" | "/analise" | "/dados" | "/perfil" | "/config";
type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Navbar: FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
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
              router.push(tab.route as any);
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
              router.push(tab.route as any);
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
          router.push(tabs[activeIndex].route as any);
        }}
      >
        <Ionicons name={tabs[activeIndex].icon as any} size={28} color={cores.surface} />
      </TouchableOpacity>
    </View>
  );
};

export default function AnaliseScreen() {
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const [activeTab, setActiveTab] = useState("scan");
  const HEADER_HEIGHT = 90; // px aproximado do header
  const NAVBAR_HEIGHT = 110; // espaço reservado para navbar
  const [step, setStep] = useState<"preparing" | "choose-method" | "camera" | "gallery">("preparing");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [confirmedImage, setConfirmedImage] = useState<string | null>(null); // imagem final para IA
  const [processing, setProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  let cameraRef: any = null;

  // Animation refs
  const prepAnim = useRef(new Animated.Value(0)).current;
  const chooseAnim = useRef(new Animated.Value(0)).current;
  const tipsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Solicita permissão da câmera ao entrar no modo câmera
  useEffect(() => {
    if (step === "camera" && hasCameraPermission === null) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      })();
    }
  }, [step]);

  // Animação pop-in ao trocar de etapa
  useEffect(() => {
    if (step === "preparing") {
      prepAnim.setValue(0);
      Animated.spring(prepAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
    } else if (step === "choose-method") {
      chooseAnim.setValue(0);
      Animated.spring(chooseAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
    }
  }, [step]);

  useEffect(() => {
    tipsAnim.setValue(0);
    Animated.spring(tipsAnim, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
  }, []);

  // Inicia animação de processamento
  useEffect(() => {
    if (processing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        })
      ).start();
      // Nota: O tempo de conclusão é controlado pela função handleConfirmImage
      // após receber resposta da API
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [processing]);

  // Adicione esta função para centralizar a confirmação
  const handleConfirmImage = async (uri: string) => {
    setConfirmedImage(uri);
    setProcessing(true);
    setPredictionError(null);
    setPhotoUri(null);
    setGalleryImage(null);

    try {
      console.log('📸 Iniciando análise de imagem...');
      const result = await predictWithRetry(uri, 3);
      console.log('✅ Resultado recebido:', result);
      setPredictionResult(result);
      console.log('✅ PredictionResult state atualizado');
      
      // Aguarda um pouco antes de mostrar resultado (mínimo 2 segundos)
      setTimeout(() => {
        console.log('⏰ Mostrando resultado após 2s');
        setProcessing(false);
        setShowResult(true);
        console.log('✅ showResult e processing atualizados');
      }, 2000);
    } catch (error) {
      console.error('❌ Erro na predição:', error);
      setProcessing(false);
      
      const errorMsg = error instanceof Error ? error.message : 'Erro ao processar imagem';
      setPredictionError(errorMsg);
      console.error('❌ Erro armazenado no state:', errorMsg);
      
      Alert.alert(
        t('analise_erro_titulo'),
        `${t('analise_erro_desc')}\n\n${errorMsg}`,
        [
          {
            text: t('analise_tentar_novamente'),
            onPress: () => {
              handleConfirmImage(uri);
            },
          },
          {
            text: t('analise_cancelar'),
            onPress: () => {
              setConfirmedImage(null);
              setPhotoUri(null);
              setGalleryImage(null);
              setStep('choose-method');
            },
          },
        ]
      );
    }
  };

  // animação para o overlay de resultado
  const showResultAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    if (showResult) {
      showResultAnim.setValue(30);
      Animated.timing(showResultAnim, { toValue: 0, duration: 320, useNativeDriver: true }).start();
    }
  }, [showResult]);

  // Estado e animação para painel de detalhes expansível
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsAnim = useRef(new Animated.Value(0)).current; // 0 = fechado, 1 = aberto

  const toggleDetails = () => {
    const toValue = detailsOpen ? 0 : 1;
    setDetailsOpen(!detailsOpen);
    // Animar altura (useNativeDriver false porque height não é suportado nativamente)
    Animated.timing(detailsAnim, { toValue, duration: 320, useNativeDriver: false }).start();
  };

  // Data/hora dinâmicas para demo
  const now = new Date();
  const demoDate = now.toLocaleDateString();
  const demoTime = now.toLocaleTimeString();

  // Função utilitária: cria PDF simples com texto 'TESTE' e abre diálogo de compartilhamento
  const createAndSharePDF = async () => {
    try {
      // Se houver imagem confirmada, converte para base64 para embutir no PDF
      let imgTag = '';
      if (confirmedImage) {
        try {
          const b64 = await FileSystem.readAsStringAsync(confirmedImage, { encoding: FileSystem.EncodingType.Base64 });
          imgTag = `<div style="text-align:center;margin-bottom:12px;"><img src="data:image/jpeg;base64,${b64}" style="max-width:100%;height:auto;border-radius:8px;"/></div>`;
        } catch (err) {
          console.warn('Não foi possível converter imagem para base64', err);
          imgTag = '';
        }
      }
      const html = `
        <html>
          <body style="font-family: Arial, Helvetica, sans-serif; padding: 28px; color: #0b3b2e;">
            <h2>Relatório de Análise Ocular</h2>
            ${imgTag}
            <h3>Anotações</h3>
            <p>Observações: TESTE - sem sinais relevantes detectados.</p>
            <p>Data: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}</p>
            <hr />
            <p>Detalhes de confiança: 87% | Olho: Ambos</p>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      const pdfName = FileSystem.documentDirectory + 'teste.pdf';
      // Copy to app document directory
      await FileSystem.copyAsync({ from: uri, to: pdfName });
      // If sharing available, open share dialog; otherwise alert location
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfName);
      } else {
        alert('PDF salvo em: ' + pdfName);
      }
    } catch (err) {
      console.error('Erro ao gerar/compartilhar PDF', err);
      alert('Erro ao gerar PDF');
    }
  };

  // Preview final removido: ao confirmar, vai direto para animação de processamento
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}> 
      {showResult ? (
        <>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, backgroundColor: cores.background }}>
            <Animated.View style={{ width: '100%', maxWidth: 520, transform: [{ translateY: showResultAnim }] }}>
              {predictionResult ? (
                <>
                  {/* Card de resultado com dados da IA */}
                  <View style={[styles.resultCard, { backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
                    <View style={{ 
                      backgroundColor: predictionResult.prediction === 'normal' ? cores.primary : '#E94B3C',
                      borderRadius: 44, 
                      width: 88, 
                      height: 88, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 12 
                    }}>
                      <Ionicons 
                        name={predictionResult.prediction === 'normal' ? "checkmark-circle" : "alert-circle"} 
                        size={54} 
                        color={cores.surface} 
                      />
                    </View>
                    <Text style={{ 
                      fontSize: 20 * fontScale, 
                      fontWeight: '700', 
                      color: predictionResult.prediction === 'normal' ? cores.primary : '#E94B3C',
                      marginBottom: 8, 
                      textAlign: 'center', 
                      flexWrap: 'wrap' 
                    }}>
                      {predictionResult.prediction === 'normal' 
                        ? t('analise_nenhum_sinal')
                        : t('analise_sinal_detectado')}
                    </Text>
                    <Text style={{ 
                      fontSize: 15 * fontScale, 
                      color: cores.text, 
                      marginBottom: 18, 
                      textAlign: 'center', 
                      flexWrap: 'wrap' 
                    }}>
                      {`${t('analise_confianca_label')}: ${(predictionResult.confidence * 100).toFixed(1)}%`}
                    </Text>
                    <View style={{ 
                      backgroundColor: predictionResult.prediction === 'normal' ? cores.primary : '#E94B3C',
                      borderRadius: 12, 
                      paddingVertical: 10, 
                      paddingHorizontal: 18, 
                      alignSelf: 'stretch' 
                    }}>
                      <Text style={{ 
                        color: cores.surface, 
                        fontWeight: '700', 
                        fontSize: 15 * fontScale, 
                        textAlign: 'center', 
                        flexWrap: 'wrap' 
                      }}>
                        {getRecommendation(predictionResult, t)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.sectionCard, { backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
                    <Text style={{ fontSize: 15 * fontScale, fontWeight: '700', color: cores.primary, marginBottom: 8, flexWrap: 'wrap' }}>{t('analise_proximos_passos')}</Text> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name={predictionResult.prediction === 'normal' ? "calendar-outline" : "alert-outline"} size={22 * fontScale} color={cores.primary} style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 14 * fontScale, color: cores.text, flexWrap: 'wrap' }}>
                        {predictionResult.prediction === 'normal'
                          ? `${t('analise_agendar_proxima')} `
                          : `${t('analise_agendar_oftalmologista')} `}
                        <Text style={{ color: cores.primary, fontWeight: '700' }}>→</Text>
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13 * fontScale, color: cores.primary, marginLeft: 30, flexWrap: 'wrap' }}>
                      {predictionResult.prediction === 'normal'
                        ? t('analise_agendar_3_meses')
                        : t('analise_agendar_urgente')}
                    </Text>
                  </View>

                  <View style={[styles.detailsWrapper, { backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
                    <TouchableOpacity activeOpacity={0.8} style={styles.detailsHeader} onPress={toggleDetails}> 
                      <Text style={[styles.detailsHeaderTitle, { color: cores.primary }]}>{t('analise_detalhes')}</Text> 
                      <Animated.View style={{ transform: [{ rotate: detailsAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}> 
                        <Ionicons name={detailsOpen ? 'chevron-up' : 'chevron-down'} size={20} color={cores.primary} /> 
                      </Animated.View> 
                    </TouchableOpacity> 
                    <Animated.View style={[styles.detailsContent, { height: detailsAnim.interpolate({ inputRange: [0,1], outputRange: [0,120] }) }]}> 
                      <View style={styles.detailRow}> 
                        <View style={styles.detailCol}> 
                          <Text style={[styles.detailLabel, { color: cores.text }]}>{t('analise_data')}</Text> 
                          <Text style={[styles.detailValue, { color: cores.primary }]}>{new Date().toLocaleDateString('pt-BR')}</Text> 
                        </View> 
                        <View style={styles.detailCol}> 
                          <Text style={[styles.detailLabel, { color: cores.text }]}>{t('analise_hora')}</Text> 
                          <Text style={[styles.detailValue, { color: cores.primary }]}>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text> 
                        </View> 
                      </View> 
                      <View style={styles.detailRow}> 
                        <View style={styles.detailCol}> 
                          <Text style={[styles.detailLabel, { color: cores.text }]}>{t('analise_confianca')}</Text> 
                          <Text style={[styles.detailValue, { color: cores.primary }]}>{(predictionResult.confidence * 100).toFixed(1)}%</Text> 
                        </View> 
                        <View style={styles.detailCol}> 
                          <Text style={[styles.detailLabel, { color: cores.text }]}>{t('analise_resultado')}</Text> 
                          <Text style={[styles.detailValue, { color: cores.primary }]}> 
                            {predictionResult.prediction === 'normal' ? t('analise_normal') : t('analise_catarata')} 
                          </Text> 
                        </View> 
                      </View> 
                    </Animated.View> 
                  </View> 
                </> 
              ) : ( 
                /* Fallback se não houver resultado */ 
                <View style={[styles.resultCard, { backgroundColor: cores.surface, shadowColor: cores.shadow }]}> 
                  <View style={{ backgroundColor: '#E94B3C', borderRadius: 44, width: 88, height: 88, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}> 
                    <Ionicons name="close-circle" size={54} color={cores.surface} /> 
                  </View> 
                  <Text style={{ fontSize: 20 * fontScale, fontWeight: '700', color: '#E94B3C', marginBottom: 8, textAlign: 'center', flexWrap: 'wrap' }}>{t('analise_erro_titulo')}</Text> 
                  <Text style={{ fontSize: 15 * fontScale, color: cores.text, marginBottom: 18, textAlign: 'center', flexWrap: 'wrap' }}>{predictionError || t('analise_erro_desconhecido')}</Text> 
                </View> 
              )}

              <View style={styles.actionRow}> 
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: cores.surface, shadowColor: cores.shadow }]} onPress={createAndSharePDF}> 
                  <Ionicons name="save-outline" size={20} color={cores.primary} style={{ marginBottom: 6 }} /> 
                  <Text style={[styles.actionBtnText, { color: cores.primary }]}>{t('analise_salvar')}</Text> 
                </TouchableOpacity> 
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: cores.surface, shadowColor: cores.shadow }]} onPress={() => { setConfirmedImage(null); setShowResult(false); setPhotoUri(null); setGalleryImage(null); setPredictionResult(null); setPredictionError(null); setStep("choose-method"); }}> 
                  <Ionicons name="refresh-outline" size={20} color={cores.primary} style={{ marginBottom: 6 }} /> 
                  <Text style={[styles.actionBtnText, { color: cores.primary }]}>{t('analise_refazer')}</Text> 
                </TouchableOpacity> 
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: cores.surface, shadowColor: cores.shadow }]} onPress={createAndSharePDF}> 
                  <Ionicons name="share-social-outline" size={20} color={cores.primary} style={{ marginBottom: 6 }} /> 
                  <Text style={[styles.actionBtnText, { color: cores.primary }]}>{t('analise_compartilhar')}</Text> 
                </TouchableOpacity> 
              </View> 
            </Animated.View>
          </View>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      ) : (
        <>
          <View style={[styles.headerFixed, { backgroundColor: cores.background, borderBottomColor: cores.surface, shadowColor: cores.shadow }]}> 
            <View style={styles.header}> 
              <View style={styles.logoContainer}> 
                <View style={[styles.logoCircle, { backgroundColor: cores.primary }]}> 
                  <Ionicons name="eye-outline" size={28} color={cores.surface} /> 
                </View> 
                <Text style={styles.logoText}> 
                  <Text style={[styles.logoOlh, { color: cores.primary }]}>Eyes</Text> 
                  <Text style={[styles.logoAI, { color: cores.primary }]}>sistant</Text> 
                </Text> 
              </View> 
              <Ionicons name="notifications-outline" size={26} color={cores.primary} /> 
            </View> 
          </View> 

          <View style={styles.analiseContainer}> 
            <Text style={[styles.analiseTitle, { color: cores.primary }]}>{t('analise_titulo')}</Text> 
            {step === "preparing" ? (
              <Animated.View style={[styles.centerContent, { opacity: prepAnim, transform: [{ scale: prepAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }]}>
                <View style={[styles.bigCircle, { backgroundColor: cores.primary }]}><Ionicons name="eye-outline" size={44} color={cores.surface} /></View>
                <Text style={[styles.prepTitle, { color: cores.primary }]}>{t('analise_preparando')}</Text>
                <Text style={[styles.prepDesc, { color: cores.text }]}>{t('analise_instrucoes')}</Text>
                <TouchableOpacity style={[styles.ctaButtonLarge, { backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => setStep("choose-method")}><Text style={[styles.ctaButtonTextLarge, { color: cores.surface }]}>{t('analise_continuar')}</Text></TouchableOpacity>
              </Animated.View>
            ) : step === "choose-method" ? (
              <Animated.View style={[styles.centerContent, { opacity: chooseAnim, transform: [{ scale: chooseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }]}>
                <Text style={[styles.prepTitle, { color: cores.primary }]}>{t('analise_como_enviar')}</Text>
                <View style={styles.chooseRow}>
                  <TouchableOpacity style={[styles.chooseButton, { backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => setStep("camera")}><Ionicons name="camera" size={38} color={cores.surface} style={{ marginBottom: 8 }} /><Text style={[styles.chooseButtonText, { color: cores.surface }]}>{t('analise_tirar_foto')}</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.chooseButton, { backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => setStep("gallery")}><Ionicons name="images" size={38} color={cores.surface} style={{ marginBottom: 8 }} /><Text style={[styles.chooseButtonText, { color: cores.surface }]}>{t('analise_galeria')}</Text></TouchableOpacity>
                </View>
              </Animated.View>
            ) : step === "camera" ? (
              <View style={[styles.cameraFullContainer, { paddingTop: 0 }]}>
                {!showResult && (<TouchableOpacity style={[styles.backButton, { backgroundColor: cores.surface, shadowColor: cores.shadow }]} onPress={() => { setPhotoUri(null); setStep("choose-method"); }}><Ionicons name="arrow-back" size={28} color={cores.primary} /></TouchableOpacity>)}
                {hasCameraPermission === false ? (
                  <Text style={[styles.prepDesc, { color: cores.text }]}>Permissão da câmera negada.</Text>
                ) : photoUri ? (
                  <View style={styles.cameraPreviewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.cameraPreview} resizeMode="contain" />
                    <View style={{ flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' }}>
                      <TouchableOpacity style={[styles.ctaButtonLarge, { flex: 1, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => setPhotoUri(null)}><Text style={[styles.ctaButtonTextLarge, { color: cores.primary }]}>{t('analise_tirar_outra')}</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.ctaButtonLarge, { flex: 1, backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => handleConfirmImage(photoUri)}><Text style={[styles.ctaButtonTextLarge, { color: cores.surface }]}>{t('analise_confirmar')}</Text></TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    {!showResult && (<CameraView ref={(ref: any) => { cameraRef = ref; }} style={{ position: 'absolute', top: HEADER_HEIGHT, left: 0, right: 0, bottom: NAVBAR_HEIGHT, width: '100%', height: '100%' }} facing="back" flash={flash} />)}
                    {!showResult && (
                      <>
                        <TouchableOpacity style={[styles.flashButton, { backgroundColor: `rgba(0,196,125,0.9)`, shadowColor: cores.shadow }]} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}><Ionicons name={flash === 'off' ? "flash-off" : "flash"} size={28} color={cores.surface} /></TouchableOpacity>
                        <TouchableOpacity style={[styles.captureButton, { backgroundColor: `rgba(0,196,125,0.95)`, shadowColor: cores.shadow }]} onPress={async () => { if (cameraRef && cameraRef.takePictureAsync) { const photo = await cameraRef.takePictureAsync(); setPhotoUri(photo.uri); } }}><Ionicons name="camera" size={36} color={cores.surface} /></TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </View>
            ) : step === "gallery" ? (
              <View style={styles.centerContent}>
                {!showResult && (<TouchableOpacity style={[styles.backButton, { backgroundColor: cores.surface, shadowColor: cores.shadow }]} onPress={() => { setGalleryImage(null); setStep("choose-method"); }}><Ionicons name="arrow-back" size={28} color={cores.primary} /></TouchableOpacity>)}
                {galleryImage ? (
                  <View style={styles.cameraPreviewContainer}>
                    <Image source={{ uri: galleryImage }} style={styles.cameraPreview} resizeMode="contain" />
                    <View style={{ flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' }}>
                      <TouchableOpacity style={[styles.ctaButtonLarge, { flex: 1, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => setGalleryImage(null)}><Text style={[styles.ctaButtonTextLarge, { color: cores.primary }]}>{t('analise_escolher_outra')}</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.ctaButtonLarge, { flex: 1, backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={() => handleConfirmImage(galleryImage)}><Text style={[styles.ctaButtonTextLarge, { color: cores.surface }]}>{t('analise_confirmar')}</Text></TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.cameraBoxEnhanced}><View style={styles.cameraCircleDashedLarge}><Ionicons name="images" size={64} color={cores.primary} style={{ opacity: 0.7 }} /></View></View>
                    <TouchableOpacity style={[styles.ctaButtonLarge, { backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={async () => { const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1, base64: false, aspect: [16, 9] }); if (!result.canceled && result.assets && result.assets[0]?.uri) { const uri = result.assets[0].uri; setGalleryImage(uri); } else if (result.canceled) { } else { alert('Selecione um arquivo .png, .jpg ou .jpeg'); } }}><Text style={[styles.ctaButtonTextLarge, { color: cores.surface }]}>{t('analise_escolher_galeria')}</Text></TouchableOpacity>
                  </>
                )}
              </View>
            ) : null}
            {processing && (<View style={[styles.centerContent, { backgroundColor: cores.background, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, justifyContent: 'center' }]}><Animated.View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: cores.surface, alignItems: 'center', justifyContent: 'center', shadowColor: cores.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 8, transform: [{ scale: pulseAnim }] }}><Animated.View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: cores.primary, borderStyle: 'dotted', transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }} /><Ionicons name="cloud-upload-outline" size={54} color={cores.primary} style={{ opacity: 0.7 }} /></Animated.View><Text style={[styles.prepTitle, { marginTop: 32, color: cores.primary }]}>{t('analise_processando')}...</Text></View>)}
          </View>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </SafeAreaView>
  );
}
