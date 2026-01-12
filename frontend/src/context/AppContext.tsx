import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Progress {
  stars: number;
  level: number;
  lettersCompleted: string[];
  wordsCompleted: string[];
  mathCompleted: number[];
  tracingCompleted: string[];
}

interface AppContextType {
  language: 'english' | 'shona' | 'both';
  setLanguage: (lang: 'english' | 'shona' | 'both') => void;
  progress: Progress;
  addStar: () => void;
  completeReading: (item: string, type: 'letter' | 'word') => void;
  completeTracing: (item: string) => void;
  completeMath: (problemId: number) => void;
  getTracingAccuracy: () => number;
  resetProgress: () => void;
}

const defaultProgress: Progress = {
  stars: 0,
  level: 1,
  lettersCompleted: [],
  wordsCompleted: [],
  mathCompleted: [],
  tracingCompleted: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<'english' | 'shona' | 'both'>('both');
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      const savedProgress = await AsyncStorage.getItem('progress');
      
      if (savedLang) {
        setLanguageState(savedLang as 'english' | 'shona' | 'both');
      }
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (e) {
      console.log('Error loading data:', e);
    }
  };

  const saveProgress = async (newProgress: Progress) => {
    try {
      await AsyncStorage.setItem('progress', JSON.stringify(newProgress));
    } catch (e) {
      console.log('Error saving progress:', e);
    }
  };

  const setLanguage = async (lang: 'english' | 'shona' | 'both') => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (e) {
      console.log('Error saving language:', e);
    }
  };

  const calculateLevel = (p: Progress): number => {
    const totalCompleted = 
      p.lettersCompleted.length + 
      p.wordsCompleted.length + 
      p.tracingCompleted.length + 
      p.mathCompleted.length;
    
    if (totalCompleted >= 40) return 5;
    if (totalCompleted >= 25) return 4;
    if (totalCompleted >= 15) return 3;
    if (totalCompleted >= 8) return 2;
    return 1;
  };

  const addStar = () => {
    const newProgress = { ...progress, stars: progress.stars + 1 };
    newProgress.level = calculateLevel(newProgress);
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const completeReading = (item: string, type: 'letter' | 'word') => {
    const key = type === 'letter' ? 'lettersCompleted' : 'wordsCompleted';
    if (!progress[key].includes(item)) {
      const newProgress = {
        ...progress,
        [key]: [...progress[key], item],
        stars: progress.stars + 1,
      };
      newProgress.level = calculateLevel(newProgress);
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  const completeTracing = (item: string) => {
    if (!progress.tracingCompleted.includes(item)) {
      const newProgress = {
        ...progress,
        tracingCompleted: [...progress.tracingCompleted, item],
        stars: progress.stars + 2,
      };
      newProgress.level = calculateLevel(newProgress);
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  const completeMath = (problemId: number) => {
    if (!progress.mathCompleted.includes(problemId)) {
      const newProgress = {
        ...progress,
        mathCompleted: [...progress.mathCompleted, problemId],
        stars: progress.stars + 1,
      };
      newProgress.level = calculateLevel(newProgress);
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  // Tracing accuracy increases with level: Level 1 = 30%, Level 5 = 70%
  const getTracingAccuracy = (): number => {
    return 0.3 + (progress.level - 1) * 0.1;
  };

  const resetProgress = async () => {
    setProgress(defaultProgress);
    try {
      await AsyncStorage.removeItem('progress');
    } catch (e) {
      console.log('Error resetting progress:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        progress,
        addStar,
        completeReading,
        completeTracing,
        completeMath,
        getTracingAccuracy,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
