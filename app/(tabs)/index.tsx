import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useIdioma } from "../../components/IdiomaContext";
import { useCores } from "../../components/TemaContext";

// Remove a navbar padrão do Expo Router
export const options = { headerShown: false };

export default function HomeScreen() {
  const router = useRouter();
  const cores = useCores();
  const { t } = useIdioma();
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}> 
      <View style={[styles.container, { backgroundColor: cores.background }]}> 
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: cores.primary }]}> 
              <Ionicons name="eye" size={22} color={cores.surface} />
            </View>
            <Text style={styles.logoText}>
              <Text style={[styles.logoEye, { color: cores.primary }]}>Eye</Text>
              <Text style={[styles.logoSsistant, { color: cores.text }]}>ssistant</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/sobre" as any)}>
            <Text style={[styles.headerLink, { color: cores.primary }]}>{t('sobre_app')}</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo central */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <Text style={[styles.title, { color: cores.text }]}>{t('index_detecte_sinais')}</Text>
          <Text style={[styles.subtitle, { color: cores.textSecundario }]}>{t('index_subtitulo')}</Text>

          {/* Cards */}
          <View style={[styles.card, { marginTop: 8, backgroundColor: cores.surface, borderColor: cores.primary }]}> 
            <View style={[styles.iconBox, { backgroundColor: cores.primary }]}> 
              <Ionicons name="camera-outline" size={22} color={cores.surface} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: cores.primary }]}>{t('index_analise_inteligente')}</Text>
              <Text style={[styles.cardDesc, { color: cores.textSecundario }]}>{t('index_tecnologia_ponta')}</Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.primary }]}> 
            <View style={[styles.iconBox, { backgroundColor: cores.primary }]}>
              <FontAwesome5 name="brain" size={20} color={cores.surface} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: cores.primary }]}>{t('index_monitoramento_continuo')}</Text>
              <Text style={[styles.cardDesc, { color: cores.textSecundario }]}>{t('index_acompanhe_saude')}</Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.primary }]}> 
            <View style={[styles.iconBox, { backgroundColor: cores.primary }]}>
              <FontAwesome5 name="shield-alt" size={18} color={cores.surface} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: cores.primary }]}>{t('index_privacidade_garantida')}</Text>
              <Text style={[styles.cardDesc, { color: cores.textSecundario }]}>{t('index_dados_protegidos')}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Botão e rodapé fixos */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: cores.primary }]}
            onPress={() => router.push("/login" as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.startButtonText, { color: cores.surface }]}>{t('index_comecar_agora')}</Text>
            <Ionicons name="arrow-forward-circle" size={22} color={cores.surface} />
          </TouchableOpacity>
          <Text style={[styles.footerText, { color: cores.textSecundario }]}>
            {t('index_termos_intro')}{' '}
            <Text style={[styles.link, { color: cores.primary }]} onPress={() => router.push("/termos" as any)}>
              {t('termos_uso')}
            </Text>{' '}
            {t('e_text')}{' '}
            <Text style={[styles.link, { color: cores.primary }]} onPress={() => router.push("/privacidade" as any)}>
              {t('politica_privacidade')}
            </Text>
          </Text>
          {/* Mini imagem/ícone */}
          <Ionicons name="eye-outline" size={22} color={cores.primary} style={{ marginTop: 8, opacity: 0.5 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: Platform.OS === "android" ? 32 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 18,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginLeft: 8,
    flexDirection: "row",
  },
  logoEye: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
  },
  logoSsistant: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
  },
  headerLink: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "transparent",
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 8, // menos espaço
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 30, // maior destaque
    textAlign: "center",
    marginTop: 32, // mais espaço acima
    marginBottom: 16, // mais espaço abaixo
    color: "transparent",
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
    color: "transparent",
    marginBottom: 32, // aumenta o espaço abaixo do subtítulo
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10, // menos espaço entre cards
    width: "100%",
    maxWidth: 420,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "transparent",
    marginBottom: 2,
  },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "transparent",
    lineHeight: 18,
  },
  bottomArea: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 8,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 420,
    gap: 8,
    marginBottom: 8,
  },
  startButtonText: {
    color: "transparent",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginRight: 2,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "transparent",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 2,
    lineHeight: 16,
  },
  link: {
    color: "transparent",
    textDecorationLine: "underline",
    fontFamily: "Inter_700Bold",
  },
});
