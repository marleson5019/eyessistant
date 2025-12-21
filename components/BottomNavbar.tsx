import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  { label: 'Início', icon: 'home-outline', route: '/inicio' },
  { label: 'Analisar', icon: 'analytics-outline', route: '/analisar' },
  { label: 'Perfil', icon: 'person-outline', route: '/perfil' },
  { label: 'Config', icon: 'settings-outline', route: '/config' },
];

export default function BottomNavbar({ activeTab }: { activeTab?: string }) {
  const router = useRouter();
  return (
    <View style={styles.navbar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          style={styles.tab}
          onPress={() => router.push(tab.route as any)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon as any}
            size={22}
            color={activeTab === tab.label.toLowerCase() ? '#00A86B' : '#3D6656'}
          />
          <Text style={[styles.label, activeTab === tab.label.toLowerCase() && styles.labelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CDE6DD',
    borderRadius: 18,
    marginHorizontal: 12,
    marginBottom: 16,
    paddingVertical: 8,
    paddingBottom: 12,
    elevation: 12,
    shadowColor: '#00A86B33',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: '#3D6656',
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: '#00A86B',
    fontWeight: '700',
  },
});
