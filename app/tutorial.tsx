import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#E6FFF5" 
  },
  headerSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#E6FFF5",
    borderBottomWidth: 1,
    borderBottomColor: "#E6F7F1",
    shadowColor: "#00A86B33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00895C",
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E6F7F1",
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: "#00C47D",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3D6656",
    textAlign: "center",
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E6FFF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    alignSelf: "center",
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00A86B",
    textAlign: "center",
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  imageWrapper: {
    padding: 2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#00C47D",
    marginBottom: 20,
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  tutorialImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3D6656",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  tipsCard: {
    backgroundColor: "#F8FFFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E6F7F1",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#00A86B",
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  tipText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3D6656",
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: 8,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  exitButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6F7F1",
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButton: {
    backgroundColor: "#00C47D",
    shadowColor: "#00895C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "800",
    flexWrap: 'wrap',
  },
  exitButtonText: {
    color: "#3D6656",
  },
  nextButtonText: {
    color: "#fff",
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default function TutorialScreen() {
  const { fontScale } = useFontSize();
  const router = useRouter();
  const cores = useCores();
  const { from } = useLocalSearchParams(); // recupera aba anterior
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const { t } = useIdioma();

  const tutorialSteps = [
    {
      image: require("../assets/images/tutorial1.jpg"),
      title: t('tutorial_step1_title'),
      description: t('tutorial_step1_desc'),
      tips: [
        t('tutorial_step1_tip1'),
        t('tutorial_step1_tip2'),
        t('tutorial_step1_tip3'),
        t('tutorial_step1_tip4')
      ]
    },
    {
      image: require("../assets/images/tutorial2.jpg"),
      title: t('tutorial_step2_title'),
      description: t('tutorial_step2_desc'),
      tips: [
        t('tutorial_step2_tip1'),
        t('tutorial_step2_tip2'),
        t('tutorial_step2_tip3')
      ]
    },
    {
      image: require("../assets/images/tutorial3.jpg"),
      title: t('tutorial_step3_title'),
      description: t('tutorial_step3_desc'),
      tips: [
        t('tutorial_step3_tip1'),
        t('tutorial_step3_tip2'),
        t('tutorial_step3_tip3')
      ]
    },
    {
      image: require("../assets/images/tutorial4.jpg"),
      title: t('tutorial_step4_title'),
      description: t('tutorial_step4_desc'),
      tips: [
        t('tutorial_step4_tip1'),
        t('tutorial_step4_tip2'),
        t('tutorial_step4_tip3')
      ]
    }
  ];

  const currentStep = tutorialSteps[step - 1];

  // Rotas válidas do app
  const validRoutes = ["inicio", "analise", "dados", "perfil", "config"];
  const getValidRoute = (route: any) => {
    if (typeof route === "string" && validRoutes.includes(route)) {
      return `/${route}`;
    }
    return "/inicio";
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* Header com Voltar e Título */}
      <View style={[styles.headerSimple, { backgroundColor: cores.background, borderBottomColor: cores.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          router.replace(getValidRoute(from) as any);
        }}>
          <Ionicons name="arrow-back" size={24} color={cores.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 18 * fontScale, color: cores.text }]}>{t('tutorial_titulo')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Indicador de Progresso */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: cores.surface }]}>
            <View style={[styles.progressFill, { width: `${(step / tutorialSteps.length) * 100}%`, backgroundColor: cores.primary }]} />
          </View>
          <Text style={[styles.progressText, { fontSize: 13 * fontScale, color: cores.textSecundario }]}>Passo {step} de {tutorialSteps.length}</Text>
        </View>

        {/* Card Principal Animado (rolável apenas este card) */}
        <Animated.View style={[styles.mainCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], maxHeight: Math.round(Dimensions.get('window').height * 0.66), backgroundColor: cores.surface }]}> 
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 28, paddingTop: 4 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            <View style={styles.iconCircle}>
              <Ionicons name="eye-outline" size={32} color={cores.primary} />
            </View>
            <Text style={[styles.welcomeTitle, { fontSize: 22 * fontScale, color: cores.text }]}>{currentStep.title}</Text>
            <View style={styles.imageWrapper}>
              <Image 
                source={currentStep.image}
                style={styles.tutorialImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.description, { fontSize: 16 * fontScale, color: cores.textSecundario }]}>{currentStep.description}</Text>
            {/* Card de Dicas */}
            <View style={[styles.tipsCard, { backgroundColor: cores.background, borderColor: cores.surface }]}>
              <View style={styles.tipsHeader}>
                <Ionicons name="information-circle-outline" size={22} color="#00A86B" />
                  <Text style={[styles.tipsTitle, { fontSize: 17 * fontScale, color: cores.primary }]}>{t('dica_label')}</Text>
              </View>
              {currentStep.tips ? (
                currentStep.tips.map((t: string, i: number) => (
                    <Text key={i} style={[styles.tipText, { marginBottom: 8, fontSize: 15 * fontScale, color: cores.textSecundario }]}>• {t}</Text>
                ))
              ) : null}
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      {/* Botões de Navegação - restaurados na parte inferior */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={[styles.navButton, styles.exitButton, { backgroundColor: cores.surface, borderColor: cores.primary }]} 
          onPress={() => {
            if (step === 1) {
              router.replace(getValidRoute(from) as any);
            } else {
              setStep(step - 1);
            }
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {step > 1 && <Ionicons name="arrow-back" size={20} color={cores.textSecundario} style={{ marginRight: 4 }} />}
            <Text style={[styles.navButtonText, styles.exitButtonText, { fontSize: 16 * fontScale, color: cores.textSecundario }]}>{step === 1 ? t('sair') : t('voltar')}</Text>
          </View>
        </TouchableOpacity>
        {step < tutorialSteps.length ? (
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, { backgroundColor: cores.primary }]} 
            onPress={() => setStep(step + 1)}
          >
            <Text style={[styles.navButtonText, styles.nextButtonText, { fontSize: 16 * fontScale }]}>{t('proximo')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, { backgroundColor: cores.primary }]} 
            onPress={() => router.push("/analise")}
          >
            <Text style={[styles.navButtonText, styles.nextButtonText, { fontSize: 16 * fontScale }]}>{t('finalizar')}</Text>
            <Ionicons name="checkmark" size={20} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
