import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../src/context/AppContext';
import { mathProblems, numbers, MathProblem } from '../src/data/math';
import SuccessModal from '../src/components/SuccessModal';
import ProgressBar from '../src/components/ProgressBar';

const { width } = Dimensions.get('window');

type ViewMode = 'menu' | 'counting' | 'addition' | 'numbers' | 'problem';

export default function MathScreen() {
  const router = useRouter();
  const { language, progress, completeMath } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', rate: 0.7 });
  };

  const handleNumberPress = (num: number) => {
    speak(num.toString());
  };

  const startProblem = (problem: MathProblem) => {
    setCurrentProblem(problem);
    setSelectedAnswer(null);
    setViewMode('problem');
    
    // Speak the question
    const question = language === 'shona' ? problem.questionShona : problem.question;
    speak(question);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answer);
    
    if (currentProblem && answer === currentProblem.answer) {
      setIsCorrect(true);
      speak('Correct! Well done!');
      completeMath(currentProblem.id);
      setTimeout(() => setShowSuccess(true), 500);
    } else {
      setIsCorrect(false);
      speak('Oops! Try again!');
      // Allow retry after a moment
      setTimeout(() => setSelectedAnswer(null), 1500);
    }
  };

  const getProblemsForType = (type: 'counting' | 'addition') => {
    return mathProblems.filter(p => p.type === type);
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#4CAF50' }]}
        onPress={() => setViewMode('numbers')}
      >
        <View style={styles.menuIconBg}>
          <Text style={styles.menuIconText}>123</Text>
        </View>
        <Text style={styles.menuTitle}>Numbers</Text>
        <Text style={styles.menuSubtitle}>Nhamba</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#2196F3' }]}
        onPress={() => setViewMode('counting')}
      >
        <View style={styles.menuIconBg}>
          <Ionicons name="apps" size={50} color="#2196F3" />
        </View>
        <Text style={styles.menuTitle}>Counting</Text>
        <Text style={styles.menuSubtitle}>Kuverenga</Text>
        <Text style={styles.menuProgress}>
          {progress.mathCompleted.filter(id => mathProblems.find(p => p.id === id)?.type === 'counting').length}/
          {getProblemsForType('counting').length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#FF9800' }]}
        onPress={() => setViewMode('addition')}
      >
        <View style={styles.menuIconBg}>
          <Ionicons name="add-circle" size={50} color="#FF9800" />
        </View>
        <Text style={styles.menuTitle}>Addition</Text>
        <Text style={styles.menuSubtitle}>Kuwedzera</Text>
        <Text style={styles.menuProgress}>
          {progress.mathCompleted.filter(id => mathProblems.find(p => p.id === id)?.type === 'addition').length}/
          {getProblemsForType('addition').length}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNumbers = () => (
    <ScrollView contentContainerStyle={styles.numberGrid}>
      {numbers.map((num) => (
        <TouchableOpacity
          key={num}
          style={styles.numberCard}
          onPress={() => handleNumberPress(num)}
        >
          <Text style={styles.numberText}>{num}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProblemList = (type: 'counting' | 'addition') => {
    const problems = getProblemsForType(type);
    return (
      <ScrollView contentContainerStyle={styles.problemList}>
        {problems.map((problem) => {
          const isCompleted = progress.mathCompleted.includes(problem.id);
          return (
            <TouchableOpacity
              key={problem.id}
              style={[styles.problemCard, isCompleted && styles.problemCardCompleted]}
              onPress={() => startProblem(problem)}
            >
              <View style={styles.problemContent}>
                {problem.objectEmoji && (
                  <Text style={styles.problemEmoji}>{problem.objectEmoji}</Text>
                )}
                <Text style={styles.problemQuestion}>{problem.question}</Text>
              </View>
              {isCompleted ? (
                <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
              ) : (
                <Ionicons name="play-circle" size={30} color="#2196F3" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderProblem = () => {
    if (!currentProblem) return null;

    return (
      <View style={styles.problemContainer}>
        <View style={styles.problemDisplay}>
          {currentProblem.type === 'counting' && currentProblem.objectEmoji && (
            <View style={styles.objectsContainer}>
              {Array.from({ length: currentProblem.num1 || 0 }).map((_, i) => (
                <Text key={i} style={styles.objectEmoji}>
                  {currentProblem.objectEmoji}
                </Text>
              ))}
            </View>
          )}
          
          {currentProblem.type === 'addition' && (
            <View style={styles.additionDisplay}>
              <View style={styles.additionGroup}>
                {Array.from({ length: currentProblem.num1 || 0 }).map((_, i) => (
                  <View key={`a${i}`} style={styles.additionDot} />
                ))}
              </View>
              <Text style={styles.additionOperator}>+</Text>
              <View style={styles.additionGroup}>
                {Array.from({ length: currentProblem.num2 || 0 }).map((_, i) => (
                  <View key={`b${i}`} style={[styles.additionDot, { backgroundColor: '#FF9800' }]} />
                ))}
              </View>
              <Text style={styles.additionOperator}>=</Text>
              <Text style={styles.additionQuestion}>?</Text>
            </View>
          )}

          <Text style={styles.questionText}>
            {language === 'shona' ? currentProblem.questionShona : currentProblem.question}
          </Text>
        </View>

        <View style={styles.answersContainer}>
          {currentProblem.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentProblem.answer;
            const showResult = selectedAnswer !== null && isSelected;
            
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.answerButton,
                  showResult && isCorrectAnswer && styles.answerCorrect,
                  showResult && !isCorrectAnswer && styles.answerWrong,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null && isCorrect}
              >
                <Text style={[
                  styles.answerText,
                  showResult && (isCorrectAnswer ? styles.answerTextCorrect : styles.answerTextWrong),
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => speak(language === 'shona' ? currentProblem.questionShona : currentProblem.question)}
        >
          <Ionicons name="volume-high" size={28} color="#2196F3" />
          <Text style={styles.speakButtonText}>Listen Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'numbers': return 'Numbers 1-20 / Nhamba';
      case 'counting': return 'Counting / Kuverenga';
      case 'addition': return 'Addition / Kuwedzera';
      case 'problem': return currentProblem?.question || 'Problem';
      default: return 'Mathematics / Masvomhu';
    }
  };

  const handleBack = () => {
    if (viewMode === 'problem') {
      setViewMode(currentProblem?.type === 'counting' ? 'counting' : 'addition');
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
        {viewMode === 'numbers' && renderNumbers()}
        {viewMode === 'counting' && renderProblemList('counting')}
        {viewMode === 'addition' && renderProblemList('addition')}
        {viewMode === 'problem' && renderProblem()}
      </View>

      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setViewMode(currentProblem?.type === 'counting' ? 'counting' : 'addition');
        }}
        message="Correct!"
        messageShona="Zvakanaka!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF9800',
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
    gap: 15,
    paddingTop: 10,
  },
  menuCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  menuIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  menuProgress: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  numberCard: {
    width: 65,
    height: 65,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  problemList: {
    gap: 12,
    paddingVertical: 10,
  },
  problemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  problemCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  problemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  problemEmoji: {
    fontSize: 30,
  },
  problemQuestion: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  problemContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  problemDisplay: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  objectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 250,
    gap: 8,
    marginBottom: 20,
  },
  objectEmoji: {
    fontSize: 36,
  },
  additionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  additionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 80,
    gap: 5,
    justifyContent: 'center',
  },
  additionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
  },
  additionOperator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  additionQuestion: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  answersContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  answerButton: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  answerCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  answerWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  answerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  answerTextCorrect: {
    color: '#2E7D32',
  },
  answerTextWrong: {
    color: '#C62828',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
    gap: 10,
  },
  speakButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
});
