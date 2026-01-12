import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../src/components/Logo';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Logo size="large" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/language')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start</Text>
            <Text style={styles.startButtonTextShona}>Tanga</Text>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={30} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SCW Digital</Text>
          <Text style={styles.footerPhone}>+263 78 709 0543</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 60,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  startButtonTextShona: {
    fontSize: 20,
    color: '#E8F5E9',
    marginTop: 2,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
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
