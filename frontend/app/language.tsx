import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import Logo from '../src/components/Logo';

type LanguageOption = 'english' | 'shona' | 'both';

interface LanguageCardProps {
  id: LanguageOption;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onSelect: () => void;
}

function LanguageCard({ title, subtitle, icon, selected, onSelect }: LanguageCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
        <Ionicons name={icon} size={40} color={selected ? '#FFF' : '#2196F3'} />
      </View>
      <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>{title}</Text>
      <Text style={[styles.cardSubtitle, selected && styles.cardSubtitleSelected]}>{subtitle}</Text>
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function LanguageScreen() {
  const router = useRouter();
  const { language, setLanguage } = useApp();

  const languages: { id: LanguageOption; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'english', title: 'English', subtitle: 'Learn in English', icon: 'language' },
    { id: 'shona', title: 'Shona', subtitle: 'Dzidza muShona', icon: 'globe' },
    { id: 'both', title: 'Both', subtitle: 'English & Shona', icon: 'swap-horizontal' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1565C0" />
        </TouchableOpacity>

        <Logo size="small" showTagline={false} />
        
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.subtitle}>Sarudza Mutauro</Text>

        <View style={styles.cardsContainer}>
          {languages.map((lang) => (
            <LanguageCard
              key={lang.id}
              {...lang}
              selected={language === lang.id}
              onSelect={() => setLanguage(lang.id)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/home')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Text style={styles.continueTextShona}>Enderera</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFF" style={styles.continueIcon} />
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#2196F3',
    marginBottom: 30,
  },
  cardsContainer: {
    width: '100%',
    gap: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircleSelected: {
    backgroundColor: '#2196F3',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitleSelected: {
    color: '#1B5E20',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardSubtitleSelected: {
    color: '#2E7D32',
  },
  checkmark: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  continueText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  continueTextShona: {
    fontSize: 14,
    color: '#E8F5E9',
    marginLeft: 10,
  },
  continueIcon: {
    marginLeft: 15,
  },
});
