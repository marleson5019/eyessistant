import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { useCadastroForm } from "../components/CadastroFormContext";
import { useFontSize } from "../components/FontSizeContext";
import { useIdioma } from "../components/IdiomaContext";
import { useCores } from "../components/TemaContext";
import { registerUser } from "../services/catarata-api";

export default function Cadastro() {
  const router = useRouter();
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const [step, setStep] = useState(1);
  const {
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    nascimento, setNascimento,
    telefone, setTelefone,
    senha, setSenha,
    confirmarSenha, setConfirmarSenha
  } = useCadastroForm();

  // Estados locais para controle de aceito, erros e modal de sucesso
  const [aceito, setAceito] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [nascimentoError, setNascimentoError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [confirmarSenhaError, setConfirmarSenhaError] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handlers simples para validação básica
  function handleEmailChange(text: string) {
    setEmail(text);
    setEmailError(text && !text.includes("@") ? t('email_invalido') : "");
  }
  function handleCpfChange(text: string) {
    setCpf(text);
    setCpfError(text && text.length < 11 ? t('cpf_invalido') : "");
  }
  function handleNascimentoChange(text: string) {
    setNascimento(text);
    setNascimentoError(text && text.length < 10 ? t('data_invalida') : "");
  }
  function handleTelefoneChange(text: string) {
    setTelefone(text);
    setTelefoneError(text && text.length < 14 ? t('telefone_invalido') : "");
  }
  function handleSenhaChange(text: string) {
    setSenha(text);
    setSenhaError(text && text.length < 6 ? t('senha_fraca') : "");
  }
  function handleConfirmarSenhaChange(text: string) {
    setConfirmarSenha(text);
    setConfirmarSenhaError(text !== senha ? t('senhas_nao_conferem') : "");
  }
  function handleContinuar() {
    // Validação simples
    if (!nome || !email || !cpf || !nascimento || !telefone) {
      Alert.alert(t('alert_preencha_campos'));
      return;
    }
    if (emailError || cpfError || nascimentoError || telefoneError) {
      Alert.alert(t('alert_corrija_erros'));
      return;
    }
    setStep(2);
  }
  function limparCampos() {
    setNome("");
    setEmail("");
    setCpf("");
    setNascimento("");
    setTelefone("");
    setSenha("");
    setConfirmarSenha("");
    setAceito(false);
    setEmailError("");
    setCpfError("");
    setNascimentoError("");
    setTelefoneError("");
    setSenhaError("");
    setConfirmarSenhaError("");
    setStep(1);
  }
  async function handleCadastrar() {
    if (!senha || !confirmarSenha || senhaError || confirmarSenhaError || !aceito) {
      Alert.alert(t('alert_preencha_aceite'));
      return;
    }
    setSubmitError(null);
    try {
      setLoading(true);
      const user = await registerUser(email, senha);
      if (user.token) {
        await AsyncStorage.setItem('eyessistant_token', user.token);
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        limparCampos();
        router.replace("/inicio");
      }, 1200);
    } catch (err: any) {
      setSubmitError(err?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formCard, { alignItems: 'center', justifyContent: 'center', backgroundColor: cores.surface }]}> 
          <View style={[styles.iconCircle, { alignSelf: 'center', marginBottom: 18, backgroundColor: cores.primary }]}> 
            <Ionicons name="eye" size={38} color="#fff" />
          </View>
          <Text style={[styles.title, { textAlign: 'center', fontSize: 22 * fontScale, color: cores.text }]}> 
            {t('cadastro_titulo')} <Text style={{ color: cores.primary, fontSize: 22 * fontScale }}>Eyessistant</Text>
          </Text>
          <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 15 * fontScale, color: cores.textSecundario }]}> 
            {step === 1 ? t('cadastro_passo1') : t('cadastro_passo2')}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressActive, { backgroundColor: cores.primary }]} />
            <View style={[styles.progressInactive, { backgroundColor: step === 2 ? cores.primary : cores.surface }]} />
          </View>
          {step === 1 ? (
            <View style={{ width: '100%' }}>
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_nome')}</Text>
              <TextInput
                style={[styles.input, { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text }]}
                placeholder={t('placeholder_nome')}
                placeholderTextColor={cores.textSecundario}
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
              {nome && nome.length < 5 ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{t('cadastro_erro_nome_curto')}</Text> : null}
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_email')}</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  email && emailError ? styles.inputError : null,
                ]}
                placeholder={t('placeholder_email')}
                placeholderTextColor={cores.textSecundario}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email && emailError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{emailError}</Text> : null}
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_cpf')}</Text>
              <TextInputMask
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  cpf && cpfError ? styles.inputError : null,
                ]}
                type={"cpf"}
                placeholder={t('placeholder_cpf')}
                placeholderTextColor={cores.textSecundario}
                value={cpf}
                onChangeText={handleCpfChange}
                keyboardType="numeric"
              />
              {cpf && cpfError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{cpfError}</Text> : null}
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_nascimento')}</Text>
              <TextInputMask
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  nascimento && nascimentoError ? styles.inputError : null,
                ]}
                type={"datetime"}
                options={{ format: "DD/MM/YYYY" }}
                placeholder={t('placeholder_nascimento')}
                placeholderTextColor={cores.textSecundario}
                value={nascimento}
                onChangeText={handleNascimentoChange}
                keyboardType="numeric"
              />
              {nascimento && nascimentoError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{nascimentoError}</Text> : null}
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_telefone')}</Text>
              <TextInputMask
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  telefone && telefoneError ? styles.inputError : null,
                ]}
                type={"cel-phone"}
                options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
                placeholder={t('placeholder_telefone')}
                placeholderTextColor={cores.textSecundario}
                value={telefone}
                onChangeText={handleTelefoneChange}
                keyboardType="phone-pad"
              />
              {telefone && telefoneError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{telefoneError}</Text> : null}
              <TouchableOpacity style={[styles.cadastrarBtn, { alignSelf: 'center', width: '100%', marginTop: 16, backgroundColor: cores.primary, shadowColor: cores.shadow }]} onPress={handleContinuar}>
                <Text style={[styles.cadastrarBtnText, { fontSize: 16 * fontScale }]}>{t('cadastro_proxima_etapa')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {step === 2 ? (
            <View style={{ width: '100%' }}>
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_senha')}</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  senha && senhaError ? styles.inputError : null,
                ]}
                placeholder={t('placeholder_senha')}
                placeholderTextColor={cores.textSecundario}
                value={senha}
                onChangeText={handleSenhaChange}
                secureTextEntry
              />
              {senha && senhaError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{senhaError}</Text> : null}
              <Text style={[styles.label, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>{t('label_confirmar_senha')}</Text>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: cores.primary, backgroundColor: cores.surface, color: cores.text },
                  confirmarSenha && confirmarSenhaError ? styles.inputError : null,
                ]}
                placeholder={t('placeholder_confirmar_senha')}
                placeholderTextColor={cores.textSecundario}
                value={confirmarSenha}
                onChangeText={handleConfirmarSenhaChange}
                secureTextEntry
              />
              {confirmarSenha && confirmarSenhaError ? <Text style={[styles.errorText, { fontSize: 13 * fontScale }]}>{confirmarSenhaError}</Text> : null}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAceito(!aceito)}
                >
                  {aceito ? (
                    <Ionicons name="checkbox" size={22} color={cores.primary} />
                  ) : (
                    <Ionicons name="square-outline" size={22} color={cores.primary} />
                  )}
                </TouchableOpacity>
                <Text style={[styles.checkboxText, { fontSize: 14 * fontScale, color: cores.textSecundario }]}>
                  {t('cadastro_li_concordo')}{' '}
                  <Text style={[styles.link, { fontSize: 14 * fontScale, color: cores.primary }]} onPress={() => router.push('/termos')}>{t('termos_uso')}</Text>{' '}
                  {t('e_text')}{' '}
                  <Text style={[styles.link, { fontSize: 14 * fontScale, color: cores.primary }]} onPress={() => router.push('/privacidade')}>{t('politica_privacidade')}</Text>
                </Text>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.voltarBtn, { borderColor: cores.primary, backgroundColor: cores.surface }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={[styles.voltarBtnText, { fontSize: 16 * fontScale, color: cores.primary }]}>{t('voltar')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.cadastrarBtn,
                    { backgroundColor: cores.primary },
                    !(senha && confirmarSenha && aceito && !senhaError && !confirmarSenhaError)
                      ? { opacity: 0.5 }
                      : {},
                  ]}
                  onPress={handleCadastrar}
                  disabled={loading || !(senha && confirmarSenha && aceito && !senhaError && !confirmarSenhaError)}
                >
                  <Text style={[styles.cadastrarBtnText, { fontSize: 16 * fontScale }]}>
                    {loading ? t('carregando') || 'Cadastrando...' : t('cadastro_cadastrar')}
                  </Text>
                </TouchableOpacity>
              </View>
              {submitError ? (
                <Text style={[styles.errorText, { marginTop: 8, fontSize: 13 * fontScale }]}>{submitError}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: cores.surface }]}>
              <View style={[styles.modalCircle, { backgroundColor: cores.background }]}>
                <Ionicons name="checkmark" size={38} color={cores.primary} />
              </View>
              <Text style={[styles.modalTitle, { fontSize: 18 * fontScale, color: cores.primary }]}>{t('modal_cadastro_titulo')}</Text>
              <Text style={[styles.modalSubtitle, { fontSize: 15 * fontScale, color: cores.textSecundario }]}>{t('modal_cadastro_subtitulo')}</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
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
    color: "transparent",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    color: "transparent",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 18,
    gap: 16,
  },
  progressActive: {
    flex: 1,
    height: 5,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  progressInactive: {
    flex: 1,
    height: 5,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  label: {
    fontFamily: "Inter_400Regular",
    color: "transparent",
    marginBottom: 4,
    marginTop: 10,
    alignSelf: "flex-start",
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
    color: "transparent",
    marginBottom: 2,
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    marginBottom: 2,
    alignSelf: "flex-start",
    fontFamily: "Inter_400Regular",
  },
  continuarBtn: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 22,
    width: "100%",
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    opacity: 1,
  },
  continuarBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18,
    marginBottom: 18,
    width: "100%",
  },
  checkbox: {
    marginRight: 8,
    marginTop: 2,
  },
  checkboxText: {
    fontFamily: "Inter_400Regular",
    color: "transparent",
    flex: 1,
    flexWrap: "wrap",
    fontSize: 14,
  },
  link: {
    color: "transparent",
    textDecorationLine: "underline",
    fontFamily: "Inter_700Bold",
    flexWrap: 'wrap',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
  },
  voltarBtn: {
    borderColor: "transparent",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "48%",
    backgroundColor: "transparent",
  },
  voltarBtnText: {
    color: "transparent",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    flexWrap: 'wrap',
  },
  cadastrarBtn: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "48%",
  },
  cadastrarBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    flexWrap: 'wrap',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: 260,
    elevation: 8,
  },
  modalCircle: {
    backgroundColor: "transparent",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    color: "transparent",
    textAlign: "center",
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  modalSubtitle: {
    fontFamily: "Inter_400Regular",
    color: "transparent",
    textAlign: "center",
    flexWrap: 'wrap',
  },
});