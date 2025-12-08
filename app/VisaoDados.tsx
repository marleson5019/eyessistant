import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useFontSize } from '../components/FontSizeContext';
import { useIdioma } from '../components/IdiomaContext';
import Navbar from '../components/Navbar';
import { useCores } from '../components/TemaContext';

const screenWidth = Dimensions.get('window').width;

const VisaoDadosScreen = () => {
  const router = useRouter();
  const { fontScale } = useFontSize();
  const cores = useCores();
  const { t } = useIdioma();
  const [activeTab, setActiveTab] = useState('geral');
  const [modalVisible, setModalVisible] = useState(false);
  const [pressedCard, setPressedCard] = useState(-1);

  // Ensure we have enough animated values for all cards across tabs
  const cardAnim = useRef(new Array(10).fill(0).map(() => new Animated.Value(0))).current;

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
  }, []);

  // Simulação de dados
  const visaoGeralData = {
    totalAnalises: 7,
    ultimaAnalise: '15/06/2025',
    olhoEsquerdo: { claridade: 85, status: t('visao_olho_esquerdo_opacidade'), lastUpdate: '30/01/2025' },
    olhoDireito: { claridade: 90, status: t('visao_nenhum_problema'), lastUpdate: '30/01/2025' },
  };

  const historicoAnalises = [
    { date: '30/01/2025', status: 'ok', title: t('visao_nenhum_sinal'), desc: t('visao_continue_monitorando') },
    { date: '17/04/2025', status: 'alert', title: t('visao_possiveis_sinais'), desc: t('visao_recomendamos_acompanhamento') },
    { date: '01/05/2025', status: 'ok', title: t('visao_nenhum_sinal'), desc: t('visao_continue_monitorando') },
    { date: '23/05/2025', status: 'alert', title: t('visao_possiveis_sinais'), desc: t('visao_recomendamos_acompanhamento') },
  ];

  const recomendacoes = {
    consultaOftalmologica: true,
    proximaTriagem: '30 dias',
    habitos: [
      t('visao_dica_pausas'),
      t('visao_boa_iluminacao'),
      t('visao_oculos_sol'),
      t('visao_dieta_vitaminas'),
    ],
  };

  const openDetailsModal = () => {
    setModalVisible(true);
  };

  const closeDetailsModal = () => {
    setModalVisible(false);
  };

  // Modal para respostas rápidas das perguntas em Recomendações / Saiba Mais
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [answerTitle, setAnswerTitle] = useState('');
  const [answerBody, setAnswerBody] = useState('');

  const openAnswerModal = (id: string) => {
    switch (id) {
      case 'catarata':
        setAnswerTitle(t('o_que_e_catarata'));
        setAnswerBody(t('catarata_body'));
        break;
      case 'prevencao':
        setAnswerTitle(t('prevencao_catarata'));
        setAnswerBody(t('prevencao_body'));
        break;
      case 'tratamentos':
        setAnswerTitle(t('tratamentos_disponiveis'));
        setAnswerBody(t('tratamentos_body'));
        break;
      default:
        setAnswerTitle('Informação');
        setAnswerBody('Informação não disponível.');
    }
    setAnswerModalVisible(true);
  };

  // Graph layout state for Evolução dos Resultados
  const [graphLayout, setGraphLayout] = useState({ width: 0, height: 0 });
  // Points as percentages (x: left%, y: top%) representing the sample data
  const evolutionPointsPercent = [
    { x: 10, y: 70 },
    { x: 30, y: 30 },
    { x: 50, y: 80 },
    { x: 70, y: 40 },
    { x: 90, y: 65 },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: cores.background }]}>
      {/* HEADER */}
      <View style={[styles.headerGradient, { backgroundColor: cores.background }]}>
        <View style={[styles.headerFixed, { shadowColor: cores.shadow }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={cores.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: 18 * fontScale, color: cores.primary }]}>{t('meus_dados_visao')}</Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={24} color={cores.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* TABS */}
      <View style={[styles.tabsContainer, { backgroundColor: cores.surface, borderBottomColor: cores.background }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'geral' && [styles.activeTab, { backgroundColor: cores.background, borderColor: cores.primary }]]}
          onPress={() => setActiveTab('geral')}
        >
          <Text style={[styles.tabText, activeTab === 'geral' && [styles.activeTabText, { color: cores.primary }], { color: cores.text }]}>{t('visao_geral')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'historico' && [styles.activeTab, { backgroundColor: cores.background, borderColor: cores.primary }]]}
          onPress={() => setActiveTab('historico')}
        >
          <Text style={[styles.tabText, activeTab === 'historico' && [styles.activeTabText, { color: cores.primary }], { color: cores.text }]}>{t('historico')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recomendacoes' && [styles.activeTab, { backgroundColor: cores.background, borderColor: cores.primary }]]}
          onPress={() => setActiveTab('recomendacoes')}
        >
          <Text style={[styles.tabText, activeTab === 'recomendacoes' && [styles.activeTabText, { color: cores.primary }], { color: cores.text }]}>{t('recomendacoes')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 12, paddingTop: 12 }}
      >
        {activeTab === 'geral' && (
          <>
            {/* STATUS ATUAL DA VISÃO */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 0 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.text }]}>{t('status_atual')}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusCol, { backgroundColor: cores.surface }]}>
                  <View style={[styles.eyeCircle, { backgroundColor: '#E6FFF5' }]}>
                    <Text style={[styles.eyeLabel, { color: '#00A86B' }]}>OE</Text>
                  </View>
                  <Text style={[styles.eyePercent, { fontSize: 16 * fontScale, color: cores.text }]}>85%</Text>
                  <Text style={[styles.eyeStatus, { fontSize: 12 * fontScale, color: '#FFD600' }]}>{t('possivel_opacidade')}</Text>
                  <Text style={[styles.eyeDate, { fontSize: 11 * fontScale, color: cores.textSecundario }]}>{t('ultima_atualizacao')}: 30/01/2025</Text>
                  <TouchableOpacity style={styles.detailsBtn} onPress={openDetailsModal}>
                    <Text style={[styles.detailsText, { fontSize: 12 * fontScale, color: cores.primary }]}>{t('detalhes')}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#00A86B" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.statusCol, { backgroundColor: cores.surface }]}>
                  <View style={[styles.eyeCircle, { backgroundColor: '#E6FFF5' }]}>
                    <Text style={[styles.eyeLabel, { color: '#00A86B' }]}>OD</Text>
                  </View>
                  <Text style={[styles.eyePercent, { fontSize: 16 * fontScale, color: cores.text }]}>90%</Text>
                  <Text style={[styles.eyeStatus, { fontSize: 12 * fontScale, color: '#00C47D' }]}>{t('nenhum_problema')}</Text>
                  <Text style={[styles.eyeDate, { fontSize: 11 * fontScale, color: cores.textSecundario }]}>{t('ultima_atualizacao')}: 30/01/2025</Text>
                  <TouchableOpacity style={styles.detailsBtn} onPress={openDetailsModal}>
                    <Text style={[styles.detailsText, { fontSize: 12 * fontScale, color: cores.primary }]}>{t('detalhes')}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#00A86B" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* RESUMO DOS RESULTADOS */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 1 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.text }]}>{t('resumo_resultados')}</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#00C47D" />
                  <Text style={[styles.summaryText, { fontSize: 14 * fontScale, color: cores.text }]}> 
                    {t('analises_sem_sinais')}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Ionicons name="alert-circle" size={20} color="#FFD600" />
                  <Text style={[styles.summaryText, { fontSize: 14 * fontScale, color: cores.text }]}> 
                    {t('analises_com_possiveis_sinais')}
                  </Text>
                </View>
              </View>
              <View style={styles.chartContainer}>
                <Text style={[styles.chartLabel, { fontSize: 12 * fontScale, color: cores.text }]}>{t('normal')}: 57% | {t('atencao')}: 43%</Text>
                <View style={styles.pieChart}>
                  <View style={[styles.pieSlice, { backgroundColor: '#00C47D', width: '57%' }]} />
                  <View style={[styles.pieSlice, { backgroundColor: '#FFD600', width: '43%' }]} />
                </View>
              </View>
            </Animated.View>

            {/* EVOLUÇÃO DOS RESULTADOS */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 2 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.text }]}>{t('evolucao_resultados')}</Text>
                <View style={styles.graphContainer}>
                  <Text style={[styles.graphLabel, { fontSize: 12 * fontScale, color: cores.text }]}>16/07 — 15/06</Text>
                <View
                      style={styles.graphLine}
                      onLayout={(e) => {
                        const { width, height } = e.nativeEvent.layout;
                        setGraphLayout({ width, height });
                      }}
                    >
                      {/* Draw connectors and points dynamically */}
                      {graphLayout.width > 0 && (
                        evolutionPointsPercent.map((pt, i) => {
                          const x = (pt.x / 100) * graphLayout.width;
                          const y = (pt.y / 100) * graphLayout.height;
                          // render connector from this point to next
                          if (i < evolutionPointsPercent.length - 1) {
                            const next = evolutionPointsPercent[i + 1];
                            const nx = (next.x / 100) * graphLayout.width;
                            const ny = (next.y / 100) * graphLayout.height;
                            const dx = nx - x;
                            const dy = ny - y;
                            const length = Math.sqrt(dx * dx + dy * dy);
                            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                            const midX = x + dx / 2;
                            const midY = y + dy / 2;
                            return (
                              <View key={`seg-${i}`} style={{ position: 'absolute', left: midX - length / 2, top: midY - 1, width: length, height: 2, backgroundColor: '#00C47D', transform: [{ rotate: `${angle}deg` }] }} />
                            );
                          }
                          return null;
                        })
                      )}
                      {graphLayout.width > 0 && (
                        evolutionPointsPercent.map((pt, i) => {
                          const x = (pt.x / 100) * graphLayout.width - 4;
                          const y = (pt.y / 100) * graphLayout.height - 4;
                          return <View key={`pt-${i}`} style={[styles.graphPoint, { position: 'absolute', left: x, top: y, backgroundColor: '#00C47D' }]} />;
                        })
                      )}
                    </View>
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#00C47D' }]} />
                        <Text style={[styles.legendText, { fontSize: 12 * fontScale, color: cores.text }]}>{t('normal')}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FFD600' }]} />
                    <Text style={[styles.legendText, { fontSize: 12 * fontScale, color: cores.text }]}>{t('atencao')}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF4D4D' }]} />
                    <Text style={[styles.legendText, { fontSize: 12 * fontScale, color: cores.text }]}>{t('critico')}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </>
        )}

        {activeTab === 'historico' && (
          <>
            {/* HISTÓRICO COMPLETO */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 0 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale, color: cores.text }]}>{t('historico_completo')}</Text>
              <View style={[styles.chartContainer, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.chartLabel, { fontSize: 12 * fontScale, color: cores.text }]}>{t('analises_por_mes')}</Text>
                <View style={styles.barChart}>
                  <View style={[styles.bar, { height: '60%', backgroundColor: '#00C47D' }]} />
                  <View style={[styles.bar, { height: '40%', backgroundColor: '#FFD600' }]} />
                  <View style={[styles.bar, { height: '80%', backgroundColor: '#00C47D' }]} />
                  <View style={[styles.bar, { height: '60%', backgroundColor: '#00C47D' }]} />
                  <View style={[styles.bar, { height: '40%', backgroundColor: '#FFD600' }]} />
                  <View style={[styles.bar, { height: '60%', backgroundColor: '#00C47D' }]} />
                </View>
                <View style={styles.barLabels}>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('jan')}</Text>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('fev')}</Text>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('mar')}</Text>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('abr')}</Text>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('mai')}</Text>
                  <Text style={[styles.barLabel, { fontSize: 10 * fontScale, color: cores.text }]}>{t('jun')}</Text>
                </View>
              </View>
            </Animated.View>

            {/* LISTA DE ANÁLISES */}
            {historicoAnalises.map((item, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.analysisCard,
                  { backgroundColor: cores.surface },
                  styles.cardShadowPop,
                  {
                    borderLeftWidth: 6,
                    borderLeftColor: item.status === 'ok' ? '#00C47D' : '#FFD600',
                    transform: [
                      { scale: cardAnim[idx + 1].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                      { translateY: cardAnim[idx + 1].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                      { scale: pressedCard === idx + 1 ? 0.97 : 1 },
                    ],
                  },
                ]}
              >
                <View style={styles.analysisHeader}>
                  <View style={[styles.statusDot, { backgroundColor: item.status === 'ok' ? '#00C47D' : '#FFD600' }]} />
                  <Text style={[styles.analysisDate, { fontSize: 13, color: cores.textSecundario }]}>• {item.date}</Text>
                </View>
                <Text style={[styles.analysisTitle, { fontSize: 15, fontWeight: '700', color: cores.text }]}>{item.title}</Text>
                <Text style={[styles.analysisDesc, { fontSize: 13, color: cores.textSecundario }]}>{item.desc}</Text>
              </Animated.View>
            ))}
          </>
        )}

        {activeTab === 'recomendacoes' && (
          <>
            {/* RECOMENDAÇÕES PERSONALIZADAS */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 0 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16, color: cores.text }]}>{t('recomendacoes_personalizadas')}</Text>
              <View style={styles.recomendacaoBox}>
                <Text style={[styles.recomendacaoTitle, { fontSize: 15, color: cores.text }]}>{t('consulta_recomendada')}</Text>
                <Text style={[styles.recomendacaoDesc, { fontSize: 13, color: cores.textSecundario }]}>{t('consulta_recomendacao_body')}</Text>
                <TouchableOpacity style={styles.ctaButton}>
                  <Text style={[styles.ctaButtonText, { fontSize: 14, color: cores.surface }]}>{t('encontrar_oftalmologistas_proximos')}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* PRÓXIMA TRIAGEM */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[1].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 1 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16, color: cores.text }]}>{t('proxima_triagem')}</Text>
              <Text style={[styles.analysisDesc, { fontSize: 13, color: cores.textSecundario }]}>
                {t('recomendamos_nova_triagem', )} {recomendacoes.proximaTriagem}.
              </Text>
              <TouchableOpacity style={styles.ctaButtonSec}>
                <Text style={[styles.ctaButtonTextSec, { fontSize: 14, color: '#00A86B' }]}>{t('agendar_lembrete')}</Text>
                <Ionicons name="calendar" size={16} color="#00A86B" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </Animated.View>

            {/* HÁBITOS SAUDÁVEIS */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[2].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 2 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16, color: cores.text }]}>{t('ha_bitossaudaveis')}</Text>
              {recomendacoes.habitos.map((habito, idx) => (
                <View key={idx} style={styles.habitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#00C47D" />
                  <Text style={[styles.habitText, { fontSize: 13, color: cores.text }]}>
                    {habito}
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* SAIBA MAIS */}
            <Animated.View
              style={[
                styles.sectionCard,
                styles.cardShadowPop,
                {
                  backgroundColor: cores.surface,
                  transform: [
                    { scale: cardAnim[3].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    { translateY: cardAnim[3].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                    { scale: pressedCard === 3 ? 0.97 : 1 },
                  ],
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { fontSize: 16, color: cores.text }]}>{t('saiba_mais')}</Text>
              <TouchableOpacity style={styles.infoItem} onPress={() => openAnswerModal('catarata')}>
                <Ionicons name="eye-outline" size={20} color="#00A86B" />
                <Text style={[styles.infoText, { fontSize: 14, color: cores.text }]}>{t('o_que_e_catarata')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#00A86B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoItem} onPress={() => openAnswerModal('prevencao')}>
                <Ionicons name="eye-outline" size={20} color="#00A86B" />
                <Text style={[styles.infoText, { fontSize: 14, color: cores.text }]}>{t('prevencao_catarata')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#00A86B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoItem} onPress={() => openAnswerModal('tratamentos')}>
                <Ionicons name="eye-outline" size={20} color="#00A86B" />
                <Text style={[styles.infoText, { fontSize: 14, color: cores.text }]}>{t('tratamentos_disponiveis')}</Text>
                <Ionicons name="chevron-forward" size={16} color="#00A86B" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* MODAL DE DETALHES */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
                  { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.modalClose} onPress={closeDetailsModal}>
              <Ionicons name="close" size={24} color="#00A86B" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { fontSize: 18 }]}>{t('status_atual')}</Text>
            <View style={styles.modalStatusRow}>
              <View style={styles.modalEyeCol}>
                <View style={[styles.modalEyeCircle, { backgroundColor: '#E6FFF5' }]}>
                  <Text style={[styles.modalEyeLabel, { color: '#00A86B' }]}>OE</Text>
                </View>
                <Text style={[styles.modalEyePercent, { fontSize: 16 }]}>85%</Text>
                <Text style={[styles.modalEyeStatus, { fontSize: 12, color: '#FFD600' }]}>{t('visao_olho_esquerdo_opacidade')}</Text>
                <Text style={[styles.modalEyeDate, { fontSize: 11 }]}>{t('ultima_atualizacao')}: 30/01/2025</Text>
              </View>
              <View style={styles.modalEyeCol}>
                <View style={[styles.modalEyeCircle, { backgroundColor: '#E6FFF5' }]}>
                  <Text style={[styles.modalEyeLabel, { color: '#00A86B' }]}>OD</Text>
                </View>
                <Text style={[styles.modalEyePercent, { fontSize: 16 }]}>90%</Text>
                <Text style={[styles.modalEyeStatus, { fontSize: 12, color: '#00C47D' }]}>{t('visao_olho_direito_normal')}</Text>
                <Text style={[styles.modalEyeDate, { fontSize: 11 }]}>{t('ultima_atualizacao')}: 30/01/2025</Text>
              </View>
            </View>
            <View style={styles.modalDiagBox}>
              <Text style={[styles.modalDiagTitle, { fontSize: 15 }]}>Detalhes do Diagnóstico</Text>
              <Text style={[styles.modalDiagText, { fontSize: 13 }]}>{t('visao_olho_esquerdo_opacidade')}</Text>
              <Text style={[styles.modalDiagText, { fontSize: 13 }]}>{t('visao_olho_direito_normal')}</Text>
              <View style={styles.modalAlertBox}>
                <Text style={[styles.modalAlertText, { fontSize: 13 }]}>{t('visao_primeiro_sintoma')}</Text>
                <Text style={[styles.modalAlertText, { fontSize: 13 }]}>{t('visao_recomenda_oftalmologista')}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL DE RESPOSTAS (Saiba Mais) */}
      <Modal
        visible={answerModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAnswerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.answerModalContent,
              {
                transform: [
                  { scale: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
                  { translateY: cardAnim[0].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.modalClose} onPress={() => setAnswerModalVisible(false)}>
              <Ionicons name="close" size={24} color="#00A86B" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { fontSize: 18 }]}>{answerTitle}</Text>
            <ScrollView style={{ marginTop: 8 }} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={[styles.modalDiagText, { fontSize: 14, lineHeight: 20 }]}>{answerBody}</Text>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* NAVBAR */}
      <Navbar activeTab="profile" setActiveTab={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  headerGradient: {
    backgroundColor: 'transparent',
    paddingBottom: 2,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  headerFixed: {
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
  backBtn: {
    padding: 6,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "transparent",
  },
  downloadBtn: {
    padding: 6,
    borderRadius: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    color: 'transparent',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'transparent',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'transparent',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusCol: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  eyeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  eyeLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  eyePercent: {
    fontSize: 16,
    fontWeight: '700',
    color: 'transparent',
    marginBottom: 4,
  },
  eyeStatus: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  eyeDate: {
    fontSize: 11,
    color: 'transparent',
    textAlign: 'center',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  detailsText: {
    color: 'transparent',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 14,
    color: 'transparent',
    marginLeft: 4,
  },
  chartContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: 'transparent',
    textAlign: 'center',
    marginBottom: 8,
  },
  pieChart: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  pieSlice: {
    height: '100%',
  },
  graphContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  graphLabel: {
    fontSize: 12,
    color: 'transparent',
    textAlign: 'center',
    marginBottom: 8,
  },
  graphLine: {
    height: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  graphLinePath: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'transparent',
    top: '50%',
    transform: [{ translateY: -1 }],
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: 'transparent',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 100,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  barLabel: {
    color: 'transparent',
  },
  analysisCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  analysisDate: {
    fontSize: 13,
    color: 'transparent',
  },
  analysisTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'transparent',
    marginBottom: 4,
  },
  analysisDesc: {
    fontSize: 13,
    color: 'transparent',
  },
  recomendacaoBox: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  recomendacaoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'transparent',
    marginBottom: 4,
  },
  recomendacaoDesc: {
    fontSize: 13,
    color: 'transparent',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: 'transparent',
    fontSize: 14,
    fontWeight: '700',
  },
  ctaButtonSec: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ctaButtonTextSec: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: '700',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  habitText: {
    fontSize: 13,
    color: '#3D6656',
    marginLeft: 8,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F7EF',
  },
  infoText: {
    fontSize: 14,
    color: '#3D6656',
    flex: 1,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
  },
  answerModalContent: {
    width: '95%',
    maxWidth: 700,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 1,
  },
  detailsSmallBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E6FFF5',
    borderRadius: 12,
  },
  detailsSmallText: {
    color: '#00A86B',
    fontWeight: '700',
    fontSize: 13,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00A86B',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalEyeCol: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0FFF8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F7EF',
  },
  modalEyeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalEyeLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalEyePercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00A86B',
    marginBottom: 4,
  },
  modalEyeStatus: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalEyeDate: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  modalDiagBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0FFF8',
    borderRadius: 16,
  },
  modalDiagTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00A86B',
    marginBottom: 8,
  },
  modalDiagText: {
    fontSize: 13,
    color: '#3D6656',
    marginBottom: 4,
  },
  modalAlertBox: {
    backgroundColor: '#FFF8E6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  modalAlertText: {
    fontSize: 13,
    color: '#3D6656',
  },
});

export default VisaoDadosScreen;