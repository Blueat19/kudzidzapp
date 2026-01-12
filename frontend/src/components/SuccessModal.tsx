import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  messageShona?: string;
  stars?: number;
}

export default function SuccessModal({
  visible,
  onClose,
  message = 'Well done!',
  messageShona = 'Waita zvakanaka!',
  stars = 1,
}: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Speak congratulation
      Speech.speak(message, { language: 'en-US', rate: 0.8 });
      setTimeout(() => {
        Speech.speak(messageShona, { rate: 0.8 });
      }, 1500);

      // Animate
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: -1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 2 }
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <View style={styles.starsContainer}>
            {Array.from({ length: stars }).map((_, i) => (
              <Ionicons key={i} name="star" size={40} color="#FFD700" />
            ))}
          </View>
          
          <Ionicons name="happy" size={80} color="#4CAF50" />
          
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.messageShona}>{messageShona}</Text>
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
    textAlign: 'center',
  },
  messageShona: {
    fontSize: 22,
    color: '#2196F3',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 25,
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
