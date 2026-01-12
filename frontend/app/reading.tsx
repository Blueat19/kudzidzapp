import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../src/context/AppContext';
import { words, letters, categories, getWordsByCategory, Word } from '../src/data/words';
import SuccessModal from '../src/components/SuccessModal';
import ProgressBar from '../src/components/ProgressBar';

const { width } = Dimensions.get('window');

type ViewMode = 'menu' | 'letters' | 'categories' | 'words';

export default function ReadingScreen() {
  const router = useRouter();
  const { language, progress, completeReading } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedCategory, setSelectedCategory] = useState<Word['category'] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentItem, setCurrentItem] = useState<{ text: string; type: 'letter' | 'word' } | null>(null);

  const speak = (text: string, lang: string = 'en-US') => {
    Speech.stop();
    Speech.speak(text, { language: lang, rate: 0.7 });
  };

  const handleLetterPress = (letter: string) => {
    speak(letter);
    if (!progress.lettersCompleted.includes(letter)) {
      setCurrentItem({ text: letter, type: 'letter' });
      completeReading(letter, 'letter');
      setShowSuccess(true);
    }
  };

  const handleWordPress = (word: Word) => {
    if (language === 'english' || language === 'both') {
      speak(word.english);
    }
    if (language === 'shona' || language === 'both') {
      setTimeout(() => speak(word.shona, 'sw'), 1000);
    }
    
    if (!progress.wordsCompleted.includes(word.id)) {
      setCurrentItem({ text: word.english, type: 'word' });
      completeReading(word.id, 'word');
      setShowSuccess(true);
    }
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#4CAF50' }]}
        onPress={() => setViewMode('letters')}
      >
        <View style={styles.menuIconBg}>
          <Text style={styles.menuIcon}>ABC</Text>
        </View>
        <Text style={styles.menuTitle}>Letters</Text>
        <Text style={styles.menuSubtitle}>Mabhii</Text>
        <Text style={styles.menuProgress}>
          {progress.lettersCompleted.length}/{letters.length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: '#2196F3' }]}
        onPress={() => setViewMode('categories')}
      >
        <View style={styles.menuIconBg}>
          <Ionicons name="book" size={50} color="#2196F3" />
        </View>
        <Text style={styles.menuTitle}>Words</Text>
        <Text style={styles.menuSubtitle}>Mashoko</Text>
        <Text style={styles.menuProgress}>
          {progress.wordsCompleted.length}/{words.length}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLetters = () => (
    <ScrollView contentContainerStyle={styles.letterGrid}>
      {letters.map((letter) => {
        const isCompleted = progress.lettersCompleted.includes(letter);
        return (
          <TouchableOpacity
            key={letter}
            style={[styles.letterCard, isCompleted && styles.letterCardCompleted]}
            onPress={() => handleLetterPress(letter)}
          >
            <Text style={[styles.letterText, isCompleted && styles.letterTextCompleted]}>
              {letter}
            </Text>
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.letterCheck} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderCategories = () => (
    <ScrollView contentContainerStyle={styles.categoryGrid}>
      {categories.map((cat) => {
        const catWords = getWordsByCategory(cat.id);
        const completed = catWords.filter(w => progress.wordsCompleted.includes(w.id)).length;
        return (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => {
              setSelectedCategory(cat.id);
              setViewMode('words');
            }}
          >
            <Ionicons name={cat.icon as any} size={40} color="#2196F3" />
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryProgress}>{completed}/{catWords.length}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderWords = () => {
    const categoryWords = selectedCategory ? getWordsByCategory(selectedCategory) : [];
    return (
      <ScrollView contentContainerStyle={styles.wordList}>
        {categoryWords.map((word) => {
          const isCompleted = progress.wordsCompleted.includes(word.id);
          return (
            <TouchableOpacity
              key={word.id}
              style={[styles.wordCard, isCompleted && styles.wordCardCompleted]}
              onPress={() => handleWordPress(word)}
            >
              <View style={styles.wordContent}>
                <Text style={styles.wordEnglish}>{word.english}</Text>
                <Text style={styles.wordShona}>{word.shona}</Text>
                <Text style={styles.wordMeaning}>{word.meaning}</Text>
              </View>
              <View style={styles.wordAction}>
                {isCompleted ? (
                  <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
                ) : (
                  <Ionicons name="volume-high" size={30} color="#2196F3" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'letters': return 'Letters / Mabhii';
      case 'categories': return 'Categories / Zvikamu';
      case 'words': return categories.find(c => c.id === selectedCategory)?.name || 'Words';
      default: return 'Reading / Kuverenga';
    }
  };

  const handleBack = () => {
    if (viewMode === 'words') setViewMode('categories');
    else if (viewMode !== 'menu') setViewMode('menu');
    else router.back();
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
        {viewMode === 'letters' && renderLetters()}
        {viewMode === 'categories' && renderCategories()}
        {viewMode === 'words' && renderWords()}
      </View>

      <SuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={currentItem?.type === 'letter' ? `Great job! ${currentItem.text}` : 'You learned a new word!'}
        messageShona={currentItem?.type === 'letter' ? `Waita zvakanaka! ${currentItem.text}` : 'Wadzidza shoko itsva!'}
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
    backgroundColor: '#4CAF50',
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
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  menuCard: {
    width: '48%',
    aspectRatio: 0.9,
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  menuIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  letterCard: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 15,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  letterTextCompleted: {
    color: '#2E7D32',
  },
  letterCheck: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    paddingVertical: 10,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  categoryProgress: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  wordList: {
    gap: 12,
    paddingVertical: 10,
  },
  wordCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
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
  wordContent: {
    flex: 1,
  },
  wordEnglish: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  wordShona: {
    fontSize: 18,
    color: '#2196F3',
    marginTop: 2,
  },
  wordMeaning: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  wordAction: {
    padding: 10,
  },
});
