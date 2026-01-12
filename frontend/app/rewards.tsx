import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../src/context/AppContext';
import ProgressBar from '../src/components/ProgressBar';
import { letters, words } from '../src/data/words';
import { mathProblems } from '../src/data/math';

const { width } = Dimensions.get('window');

export default function RewardsScreen() {
  const router = useRouter();
  const { progress, resetProgress } = useApp();

  const achievements = [
    {
      id: 'letters',
      title: 'Letter Master',
      titleShona: 'Gwara reMabhii',
      icon: 'text',
      color: '#4CAF50',
      current: progress.lettersCompleted.length,
      total: letters.length,
      stars: 1,
    },
    {
      id: 'words',
      title: 'Word Wizard',
      titleShona: 'N\'anga yeMashoko',
      icon: 'book',
      color: '#2196F3',
      current: progress.wordsCompleted.length,
      total: words.length,
      stars: 1,
    },
    {
      id: 'tracing',
      title: 'Writing Star',
      titleShona: 'Nyeredzi yeKunyora',
      icon: 'create',
      color: '#9C27B0',
      current: progress.tracingCompleted.length,
      total: letters.length + 15,
      stars: 2,
    },
    {
      id: 'math',
      title: 'Math Champion',
      titleShona: 'Shasha yeMasvomhu',
      icon: 'calculator',
      color: '#FF9800',
      current: progress.mathCompleted.length,
      total: mathProblems.length,
      stars: 1,
    },
  ];

  const unlockedSongs = [
    { level: 1, title: 'Happy Learning!', titleShona: 'Kudzidza Kunofadza!', unlocked: progress.level >= 1 },
    { level: 2, title: 'Super Star!', titleShona: 'Nyeredzi Huru!', unlocked: progress.level >= 2 },
    { level: 3, title: 'Amazing Progress!', titleShona: 'Kufambira Mberi Kwakanaka!', unlocked: progress.level >= 3 },
    { level: 4, title: 'Almost There!', titleShona: 'Wava Pedyo!', unlocked: progress.level >= 4 },
    { level: 5, title: 'Champion Song!', titleShona: 'Rwiyo rweShasha!', unlocked: progress.level >= 5 },
  ];

  const playSong = (title: string) => {
    Speech.speak(`Congratulations! ${title}`, { language: 'en-US', rate: 0.8 });
    setTimeout(() => {
      Speech.speak('You are doing great! Keep learning!', { rate: 0.7 });
    }, 2000);
  };

  const handleReset = () => {
    resetProgress();
    Speech.speak('Progress reset. Let\'s start fresh!', { rate: 0.8 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards / Mibayiro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar level={progress.level} stars={progress.stars} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements / Zvawakawana</Text>
          
          {achievements.map((achievement) => {
            const percentage = Math.round((achievement.current / achievement.total) * 100);
            const isComplete = achievement.current >= achievement.total;
            
            return (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  <Ionicons name={achievement.icon as any} size={30} color="#FFF" />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementTitleShona}>{achievement.titleShona}</Text>
                  <View style={styles.achievementProgressBar}>
                    <View 
                      style={[
                        styles.achievementProgressFill, 
                        { width: `${percentage}%`, backgroundColor: achievement.color }
                      ]} 
                    />
                  </View>
                  <Text style={styles.achievementProgressText}>
                    {achievement.current}/{achievement.total}
                  </Text>
                </View>
                {isComplete && (
                  <View style={styles.achievementBadge}>
                    <Ionicons name="ribbon" size={30} color="#FFD700" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Celebration Songs / Nziyo</Text>
          
          {unlockedSongs.map((song) => (
            <TouchableOpacity
              key={song.level}
              style={[styles.songCard, !song.unlocked && styles.songCardLocked]}
              onPress={() => song.unlocked && playSong(song.title)}
              disabled={!song.unlocked}
            >
              <View style={[styles.songLevel, song.unlocked && styles.songLevelUnlocked]}>
                <Text style={[styles.songLevelText, song.unlocked && styles.songLevelTextUnlocked]}>
                  {song.level}
                </Text>
              </View>
              <View style={styles.songContent}>
                <Text style={[styles.songTitle, !song.unlocked && styles.songTitleLocked]}>
                  {song.title}
                </Text>
                <Text style={styles.songTitleShona}>{song.titleShona}</Text>
              </View>
              {song.unlocked ? (
                <Ionicons name="play-circle" size={40} color="#4CAF50" />
              ) : (
                <Ionicons name="lock-closed" size={30} color="#999" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Your Stats / Zvawakwanisa</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={30} color="#FFD700" />
              <Text style={styles.statValue}>{progress.stars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={30} color="#FF9800" />
              <Text style={styles.statValue}>{progress.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
              <Text style={styles.statValue}>
                {progress.lettersCompleted.length + progress.wordsCompleted.length + 
                 progress.tracingCompleted.length + progress.mathCompleted.length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={20} color="#F44336" />
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>

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
    backgroundColor: '#F3E5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9C27B0',
    padding: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  achievementIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementTitleShona: {
    fontSize: 12,
    color: '#666',
  },
  achievementProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementBadge: {
    marginLeft: 10,
  },
  songCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  songCardLocked: {
    opacity: 0.6,
  },
  songLevel: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songLevelUnlocked: {
    backgroundColor: '#9C27B0',
  },
  songLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
  },
  songLevelTextUnlocked: {
    color: '#FFF',
  },
  songContent: {
    flex: 1,
    marginLeft: 15,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  songTitleLocked: {
    color: '#999',
  },
  songTitleShona: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    marginTop: 25,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
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
