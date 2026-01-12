import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressBarProps {
  level: number;
  stars: number;
  compact?: boolean;
}

export default function ProgressBar({ level, stars, compact = false }: ProgressBarProps) {
  const levelProgress = Math.min((stars % 10) * 10, 100);
  const maxLevel = 5;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactItem}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.compactText}>{stars}</Text>
        </View>
        <View style={styles.compactItem}>
          <Ionicons name="trophy" size={20} color="#2196F3" />
          <Text style={styles.compactText}>Lv.{level}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
        <View style={styles.starsContainer}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.starsText}>{stars}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {level < maxLevel ? `${10 - (stars % 10)} stars to Level ${level + 1}` : 'Max Level!'}
        </Text>
      </View>

      <View style={styles.levelIndicators}>
        {[1, 2, 3, 4, 5].map((l) => (
          <View
            key={l}
            style={[
              styles.levelDot,
              l <= level ? styles.levelDotActive : styles.levelDotInactive,
            ]}
          >
            <Text style={[styles.levelDotText, l <= level && styles.levelDotTextActive]}>
              {l}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginLeft: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 5,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  levelIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelDotActive: {
    backgroundColor: '#2196F3',
  },
  levelDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  levelDotText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  levelDotTextActive: {
    color: '#FFF',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  compactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
