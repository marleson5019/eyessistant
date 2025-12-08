import { Inter_400Regular, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";

const { width } = Dimensions.get("window");

export default function Login() {
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  function validarEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleEmailChange(val: string) {
    setEmail(val);
    if (val && !validarEmail(val)) setEmailError(t('email_invalido'));
    else setEmailError("");
  }

  function handleSenhaChange(val: string) {
    setSenha(val);
    if (val && val.length < 6) setSenhaError(t('senha_fraca'));
    else setSenhaError("");
  }

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      {/* Voltar */}
  <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={cores.primary} />
        <Text style={[styles.backText, { fontSize: 15 * fontScale, color: cores.primary }]}>{t('voltar')}</Text>
      </TouchableOpacity>

      {/* Ícone e título */}
      <View style={[styles.iconCircle, { backgroundColor: cores.primary }]}>
        <Ionicons name="eye" size={38} color="#fff" />
      </View>
    <Text style={[styles.title, { fontSize: 22 * fontScale, color: cores.text }]}> 
      {t('login_entrar')} {""}
  <Text style={[styles.logoEye, { fontSize: 22 * fontScale, color: cores.primary }]}>Eye</Text>
  <Text style={[styles.logoSsistant, { fontSize: 22 * fontScale, color: cores.text }]}>ssistant</Text>
      </Text>

      {/* Formulário */}
      <View style={styles.form}>
          <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_email')}</Text>
        <TextInput
          style={[
            styles.input,
            { fontSize: 15 * fontScale, borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
            email && emailError ? styles.inputError : null,
          ]}
          placeholder={t('placeholder_email')}
          placeholderTextColor={cores.textSecundario}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {email && emailError ? (
          <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{emailError}</Text>
        ) : null}
          <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_senha')}</Text>
        <TextInput
          style={[
            styles.input,
            { fontSize: 15 * fontScale, borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
            senha && senhaError ? styles.inputError : null,
          ]}
          placeholder={t('placeholder_senha')}
          placeholderTextColor={cores.textSecundario}
          value={senha}
          onChangeText={handleSenhaChange}
          secureTextEntry
        />
        {senha && senhaError ? (
          <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{senhaError}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: cores.primary }]}
          onPress={() => router.replace("/inicio")}
        >
                      <Text style={[styles.loginBtnText, { fontSize: 16 * fontScale }]}>{t('login_entrar')}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
                      <Text style={[styles.link, { fontSize: 14 * fontScale, color: cores.primary }]}>{t('login_esqueci_senha')}</Text>
        </TouchableOpacity>
      </View>

      {/* Ou */}
      <View style={styles.orContainer}>
        <View style={[styles.line, { backgroundColor: cores.textSecundario }]} />
            <Text style={[styles.orText, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('ou_text')}</Text>
        <View style={[styles.line, { backgroundColor: cores.textSecundario }]} />
      </View>

      {/* Continuar como convidado */}
      <TouchableOpacity
        style={[styles.guestBtn, { borderColor: cores.primary, backgroundColor: cores.surface }]}
        onPress={() => router.replace("/inicio")}
      >
            <Text style={[styles.guestBtnText, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('login_continuar_convidado')}</Text>
      </TouchableOpacity>

      {/* Cadastro */}
      <Text style={[styles.footerText, { fontSize: 13 * fontScale, color: cores.textSecundario }]}> 
        {t('login_nao_tem_conta')} {" "}
        <Text style={[styles.link, { fontSize: 14 * fontScale, color: cores.primary }]} onPress={() => router.push("/cadastro" as any)}>
          {t('cadastre_se')}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 18,
    gap: 2,
  },
  backText: {
    color: "transparent",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    marginLeft: 2,
    flexWrap: 'wrap',
  },
  iconCircle: {
    backgroundColor: "transparent",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "transparent",
    textAlign: "center",
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  logoEye: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
    flexWrap: 'wrap',
  },
  logoSsistant: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
    flexWrap: 'wrap',
  },
  form: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "transparent",
    marginBottom: 4,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "transparent",
    marginBottom: 2,
  },
  inputError: {
    borderColor: "#E53935",
  },
  loginBtn: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
    width: "100%",
    shadowColor: "#00A86B33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  loginBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    flexWrap: 'wrap',
  },
  link: {
    color: "transparent",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
    flexWrap: 'wrap',
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 18,
  },
  orText: {
    fontFamily: "Inter_400Regular",
    color: "transparent",
    fontSize: 14,
    marginHorizontal: 8,
    flexWrap: 'wrap',
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "transparent",
    borderRadius: 1,
  },
  guestBtn: {
    borderColor: "transparent",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
    backgroundColor: "transparent",
  },
  guestBtnText: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    flexWrap: 'wrap',
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "transparent",
    textAlign: "center",
    marginTop: 2,
    flexWrap: 'wrap',
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
    marginBottom: 2,
    flexWrap: 'wrap',
    alignSelf: "flex-start",
    fontFamily: "Inter_400Regular",
  },
});
