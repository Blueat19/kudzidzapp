import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import Logo from '../src/components/Logo';
import ProgressBar from '../src/components/ProgressBar';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface MenuCardProps {
  title: string;
  titleShona: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

function MenuCard({ title, titleShona, icon, color, onPress }: MenuCardProps) {
  return (
    <TouchableOpacity
      style={[styles.menuCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={50} color="#FFF" />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuTitleShona}>{titleShona}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useApp();

  const menuItems: MenuCardProps[] = [
    {
      title: 'Reading',
      titleShona: 'Kuverenga',
      icon: 'book',
      color: '#4CAF50',
      onPress: () => router.push('/reading'),
    },
    {
      title: 'Writing',
      titleShona: 'Kunyora',
      icon: 'create',
      color: '#2196F3',
      onPress: () => router.push('/writing'),
    },
    {
      title: 'Mathematics',
      titleShona: 'Masvomhu',
      icon: 'calculator',
      color: '#FF9800',
      onPress: () => router.push('/math'),
    },
    {
      title: 'Rewards',
      titleShona: 'Mibayiro',
      icon: 'trophy',
      color: '#9C27B0',
      onPress: () => router.push('/rewards'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/language')}
          >
            <Ionicons name="settings" size={28} color="#1565C0" />
          </TouchableOpacity>
          <Logo size="small" showTagline={false} />
          <View style={styles.headerRight}>
            <ProgressBar level={progress.level} stars={progress.stars} compact />
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello!</Text>
          <Text style={styles.welcomeTextShona}>Mhoro!</Text>
          <Text style={styles.welcomeSubtext}>What do you want to learn today?</Text>
        </View>

        <ProgressBar level={progress.level} stars={progress.stars} />

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SCW Digital</Text>
          <Text style={styles.footerPhone}>+263 78 709 0543</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  welcomeTextShona: {
    fontSize: 24,
    color: '#2196F3',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  menuCard: {
    width: cardWidth,
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  menuIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  menuTitleShona: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  footerPhone: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
