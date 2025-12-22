import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFontSize } from '../components/FontSizeContext';
import { useIdioma } from '../components/IdiomaContext';
import { useCores } from '../components/TemaContext';
import { fetchProfile, imageUriToBase64, updateProfile } from '../services/catarata-api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('eyessistant_token');
        if (token) {
          try {
            const profile = await fetchProfile(token);
            if (profile.name) setName(profile.name);
            if (profile.email) setEmail(profile.email);
            if (profile.cpf) setCpf(profile.cpf);
            if (profile.photo_base64) setPhoto(`data:image/jpeg;base64,${profile.photo_base64}`);
            // cache local
            if (profile.name) await AsyncStorage.setItem('profileName', profile.name);
            if (profile.email) await AsyncStorage.setItem('profileEmail', profile.email);
            if (profile.cpf) await AsyncStorage.setItem('profileCPF', profile.cpf);
            if (profile.photo_base64) await AsyncStorage.setItem('profilePhoto', `data:image/jpeg;base64,${profile.photo_base64}`);
          } catch (err) {
            // fallback para cache local
            const storedName = await AsyncStorage.getItem('profileName');
            const storedPhoto = await AsyncStorage.getItem('profilePhoto');
            const storedEmail = await AsyncStorage.getItem('profileEmail');
            const storedCpf = await AsyncStorage.getItem('profileCPF');
            if (storedName) setName(storedName);
            if (storedPhoto) setPhoto(storedPhoto);
            if (storedEmail) setEmail(storedEmail);
            if (storedCpf) setCpf(storedCpf);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();
  }, []);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('editperfil_permissao_titulo'), t('editperfil_permissao_body'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled) {
        // @ts-ignore
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setPhoto(uri);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const save = async () => {
    try {
      const token = await AsyncStorage.getItem('eyessistant_token');
      if (!token) {
        Alert.alert(t('alert_preencha_campos'), t('Token não encontrado, faça login novamente.'));
        return;
      }
      let photo_base64: string | undefined;
      if (photo) {
        try {
          const base64 = await imageUriToBase64(photo);
          photo_base64 = base64;
        } catch (e) {
          console.warn('Erro ao converter foto', e);
        }
      }

      const updated = await updateProfile(token, {
        name,
        email,
        cpf,
        photo_base64,
        new_password: password || undefined,
      });

      if (updated.name) await AsyncStorage.setItem('profileName', updated.name);
      if (updated.email) await AsyncStorage.setItem('profileEmail', updated.email);
      if (updated.cpf) await AsyncStorage.setItem('profileCPF', updated.cpf);
      if (updated.photo_base64) await AsyncStorage.setItem('profilePhoto', `data:image/jpeg;base64,${updated.photo_base64}`);

      Alert.alert(t('editperfil_salvo_titulo'), t('editperfil_salvo_body'));
      router.back();
    } catch (e: any) {
      Alert.alert(t('editperfil_erro_titulo'), e?.message || t('editperfil_erro_body'));
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      <View style={[styles.header, { backgroundColor: cores.background, borderBottomColor: cores.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={cores.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: cores.text }]}>{t('editperfil_titulo')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }], backgroundColor: cores.surface }]}>
          <View style={styles.photoRow}>
            <TouchableOpacity onPress={pickImage} style={styles.photoWrapper}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: cores.background, borderColor: cores.surface }]}>
                  <Ionicons name="person" size={48} color={cores.primary} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.changePhotoBtn}>
              <Text style={[styles.changePhotoText, { color: cores.primary }]}>{t('alterar_foto')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: cores.textSecundario }]}>{t('label_nome')}</Text>
            <TextInput value={name} onChangeText={setName} placeholder={t('placeholder_seu_nome')} style={[styles.input, { borderColor: cores.primary, backgroundColor: cores.background, color: cores.text }]} placeholderTextColor={cores.textSecundario} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: cores.textSecundario }]}>{t('label_email')}</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder={t('placeholder_email')} keyboardType="email-address" style={[styles.input, { borderColor: cores.primary, backgroundColor: cores.background, color: cores.text }]} placeholderTextColor={cores.textSecundario} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: cores.textSecundario }]}>{t('label_cpf')}</Text>
            <TextInput value={cpf} onChangeText={setCpf} placeholder={t('placeholder_cpf')} keyboardType="numeric" style={[styles.input, { borderColor: cores.primary, backgroundColor: cores.background, color: cores.text }]} placeholderTextColor={cores.textSecundario} />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: cores.textSecundario }]}>{t('label_senha')}</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder={t('placeholder_senha')} secureTextEntry style={[styles.input, { borderColor: cores.primary, backgroundColor: cores.background, color: cores.text }]} placeholderTextColor={cores.textSecundario} />
          </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: cores.primary }]} onPress={save}>
            <Text style={styles.saveText}>{t('salvar')}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: 'transparent' },
  backBtn: { padding: 6 },
  title: { fontSize: 18, fontWeight: '700', color: 'transparent' },
  container: { padding: 20 },
  card: { backgroundColor: 'transparent', borderRadius: 18, padding: 16, shadowColor: '#00A86B22', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
  photoRow: { alignItems: 'center', marginBottom: 20 },
  photoWrapper: { borderRadius: 80, overflow: 'hidden' },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  changePhotoBtn: { marginTop: 8 },
  changePhotoText: { color: 'transparent', fontWeight: '700' },
  field: { marginVertical: 8 },
  label: { color: 'transparent', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: 'transparent', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  saveBtn: { backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#fff', fontWeight: '700' },
});
