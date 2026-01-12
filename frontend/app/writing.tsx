import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import * as Speech from 'expo-speech';
import { useApp } from '../src/context/AppContext';
import { letters, words, Word } from '../src/data/words';
import SuccessModal from '../src/components/SuccessModal';
import ProgressBar from '../src/components/ProgressBar';

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(screenWidth - 60, 300);

type ViewMode = 'menu' | 'letters' | 'words' | 'tracing';

interface Point {
  x: number;
  y: number;
}

const tracingWords = words.slice(0, 15); // First 15 words for tracing

export default function WritingScreen() {
  const router = useRouter();
  const { progress, completeTracing, getTracingAccuracy } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [currentItem, setCurrentItem] = useState<string>('');
  const [currentItemType, setCurrentItemType] = useState<'letter' | 'word'>('letter');
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [tracingProgress, setTracingProgress] = useState(0);

  const accuracy = getTracingAccuracy();
  
  // Get target points for the current letter/word
  const getTargetPoints = (char: string): Point[] => {
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const size = CANVAS_SIZE * 0.6;
    
    // Simple approximation of letter shapes
    const points: Point[] = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Create a simple path based on the letter
      points.push({
        x: centerX + Math.sin(t * Math.PI * 2) * (size / 3),
        y: centerY - size / 2 + t * size,
      });
    }
    return points;
  };

  // Calculate tracing accuracy
  const calculateTracingScore = (): number => {
    if (currentPath.length < 10) return 0;
    
    const targetPoints = getTargetPoints(currentItem);
    let matchedPoints = 0;
    
    currentPath.forEach(point => {
      // Check if point is within acceptable range of any target point
      const isNearTarget = targetPoints.some(target => {
        const distance = Math.sqrt(
          Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2)
        );
        return distance < CANVAS_SIZE * (1 - accuracy) * 0.5; // Accuracy affects tolerance
      });
      if (isNearTarget) matchedPoints++;
    });
    
    return matchedPoints / currentPath.length;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
        
        // Update progress indicator
        const progress = Math.min(currentPath.length / 50, 1);
        setTracingProgress(progress);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 0) {
          const pathString = currentPath
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
          setPaths(prev => [...prev, pathString]);
        }
        setCurrentPath([]);
      },
    })
  ).current;

  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    const score = calculateTracingScore();
    
    // Accuracy threshold based on level
    const threshold = accuracy * 0.5 + 0.2; // 35% at level 1, 55% at level 5
    
    if (score >= threshold || attempts >= 2) {
      // Success - be lenient for kids
      Speech.speak('Well done!', { language: 'en-US', rate: 0.8 });
      completeTracing(currentItem);
      setShowSuccess(true);
    } else {
      // Encourage to try again
      Speech.speak('Good try! Let\'s try again!', { language: 'en-US', rate: 0.8 });
      handleClear();
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    setTracingProgress(0);
  };

  const startTracing = (item: string, type: 'letter' | 'word') => {
    setCurrentItem(item);
    setCurrentItemType(type);
    setViewMode('tracing');
    setAttempts(0);
    handleClear();
    Speech.speak(`Trace the ${type}: ${item}`, { language: 'en-US', rate: 0.7 });
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#2196F3' }]}
        onPress={() => setViewMode('letters')}
      >
        <View style={styles.menuIconBg}>
          <Ionicons name="create" size={50} color="#2196F3" />
        </View>
        <Text style={styles.menuTitle}>Trace Letters</Text>
        <Text style={styles.menuSubtitle}>Nyora Mabhii</Text>
        <Text style={styles.menuProgress}>
          {progress.tracingCompleted.filter(t => t.length === 1).length}/{letters.length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#FF9800' }]}
        onPress={() => setViewMode('words')}
      >
        <View style={styles.menuIconBg}>
          <Ionicons name="pencil" size={50} color="#FF9800" />
        </View>
        <Text style={styles.menuTitle}>Trace Words</Text>
        <Text style={styles.menuSubtitle}>Nyora Mashoko</Text>
        <Text style={styles.menuProgress}>
          {progress.tracingCompleted.filter(t => t.length > 1).length}/{tracingWords.length}
        </Text>
      </TouchableOpacity>

      <View style={styles.levelInfo}>
        <Ionicons name="information-circle" size={24} color="#2196F3" />
        <Text style={styles.levelInfoText}>
          Level {progress.level}: Accuracy required {Math.round(accuracy * 100)}%
        </Text>
      </View>
    </View>
  );

  const renderLetterSelection = () => (
    <ScrollView contentContainerStyle={styles.letterGrid}>
      {letters.map((letter) => {
        const isCompleted = progress.tracingCompleted.includes(letter);
        return (
          <TouchableOpacity
            key={letter}
            style={[styles.letterCard, isCompleted && styles.letterCardCompleted]}
            onPress={() => startTracing(letter, 'letter')}
          >
            <Text style={[styles.letterText, isCompleted && styles.letterTextCompleted]}>
              {letter}
            </Text>
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={styles.check} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderWordSelection = () => (
    <ScrollView contentContainerStyle={styles.wordGrid}>
      {tracingWords.map((word) => {
        const isCompleted = progress.tracingCompleted.includes(word.english);
        return (
          <TouchableOpacity
            key={word.id}
            style={[styles.wordCard, isCompleted && styles.wordCardCompleted]}
            onPress={() => startTracing(word.english, 'word')}
          >
            <Text style={styles.wordEnglish}>{word.english}</Text>
            <Text style={styles.wordShona}>{word.shona}</Text>
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.wordCheck} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderTracing = () => (
    <View style={styles.tracingContainer}>
      <View style={styles.tracingHeader}>
        <Text style={styles.tracingInstruction}>Trace the {currentItemType}:</Text>
        <Text style={styles.tracingItem}>{currentItem}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${tracingProgress * 100}%` }]} />
      </View>

      <View style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE }]} {...panResponder.panHandlers}>
        {/* Dotted letter guide */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideText}>{currentItem}</Text>
        </View>
        
        {/* SVG for drawing */}
        <Svg style={StyleSheet.absoluteFill}>
          {/* Drawn paths */}
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke="#2196F3"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {/* Current path */}
          {currentPath.length > 0 && (
            <Path
              d={currentPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke="#4CAF50"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>

      <View style={styles.tracingButtons}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons name="trash" size={24} color="#F44336" />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
          <Ionicons name="checkmark" size={28} color="#FFF" />
          <Text style={styles.checkButtonText}>Done!</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hintText}>
        Draw over the letters with your finger!
      </Text>
    </View>
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'letters': return 'Trace Letters / Nyora Mabhii';
      case 'words': return 'Trace Words / Nyora Mashoko';
      case 'tracing': return `Tracing: ${currentItem}`;
      default: return 'Writing / Kunyora';
    }
  };

  const handleBack = () => {
    if (viewMode === 'tracing') {
      setViewMode(currentItemType === 'letter' ? 'letters' : 'words');
    } else if (viewMode !== 'menu') {
      setViewMode('menu');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <ProgressBar level={progress.level} stars={progress.stars} compact />
      </View>

      <View style={styles.content}>
        {viewMode === 'menu' && renderMenu()}
        {viewMode === 'letters' && renderLetterSelection()}
        {viewMode === 'words' && renderWordSelection()}
        {viewMode === 'tracing' && renderTracing()}
      </View>

      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setViewMode(currentItemType === 'letter' ? 'letters' : 'words');
        }}
        message="Excellent tracing!"
        messageShona="Wanyora zvakanaka!"
        stars={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    padding: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  menuContainer: {
    paddingTop: 20,
    gap: 20,
  },
  menuCard: {
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  menuIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  menuSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  menuProgress: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 15,
    gap: 10,
  },
  levelInfoText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  letterCard: {
    width: 55,
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  letterCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  letterText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  letterTextCompleted: {
    color: '#2E7D32',
  },
  check: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  wordGrid: {
    gap: 12,
    paddingVertical: 10,
  },
  wordCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  wordCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  wordEnglish: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  wordShona: {
    fontSize: 16,
    color: '#2196F3',
  },
  wordCheck: {
    marginLeft: 10,
  },
  tracingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tracingHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  tracingInstruction: {
    fontSize: 16,
    color: '#666',
  },
  tracingItem: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  canvas: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  guideContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideText: {
    fontSize: 150,
    fontWeight: 'bold',
    color: '#E0E0E0',
    letterSpacing: -10,
  },
  tracingButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  checkButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  hintText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
