import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export default function Logo({ size = 'medium', showTagline = true }: LogoProps) {
  const sizes = {
    small: { icon: 40, title: 18, subtitle: 10 },
    medium: { icon: 80, title: 28, subtitle: 14 },
    large: { icon: 120, title: 36, subtitle: 18 },
  };

  const s = sizes[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: s.icon * 1.5, height: s.icon * 1.5 }]}>
        <Ionicons name="book" size={s.icon} color="#FFFFFF" />
        <View style={[styles.starBadge, { top: -5, right: -5 }]}>
          <Ionicons name="star" size={s.icon * 0.3} color="#FFD700" />
        </View>
      </View>
      <Text style={[styles.title, { fontSize: s.title }]}>Tanga Kudzidza</Text>
      <Text style={[styles.subtitle, { fontSize: s.subtitle }]}>Start Learning</Text>
      {showTagline && (
        <Text style={[styles.tagline, { fontSize: s.subtitle * 0.8 }]}>
          Learn Shona & English
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  starBadge: {
    position: 'absolute',
    backgroundColor: '#1565C0',
    borderRadius: 15,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
  },
  subtitle: {
    color: '#2196F3',
    fontWeight: '600',
    textAlign: 'center',
  },
  tagline: {
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
