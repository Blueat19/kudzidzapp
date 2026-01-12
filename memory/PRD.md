# Tanga Kudzidza / Start Learning - Product Requirements Document

## 1. Product Overview

### App Name
**Tanga Kudzidza** (Shona) / **Start Learning** (English)

### Target Users
Children aged 3-5 years

### Developer
**SCW Digital**  
Contact: +263 78 709 0543

### Purpose
Help children:
- Learn Shona & English languages
- Practice reading letters and words
- Practice writing by tracing
- Learn simple mathematics
- Stay motivated through levels, progress bars & celebration songs

### Platform
- React Native (Expo)
- iOS & Android compatible
- Touch-based interaction
- Offline-first (data stored locally)

---

## 2. Core Features

### 2.1 Reading Module
- Letters A-Z with audio pronunciation
- 59+ bilingual word pairs
- 8 word categories (Family, Animals, School, Food, Nature, Colors, Actions, Home)
- Text-to-Speech audio
- Progress tracking

### 2.2 Writing (Tracing) Module
- Single letter tracing (A-Z)
- Word tracing
- Progressive accuracy requirements:
  - Level 1: 30% accuracy
  - Level 2: 40% accuracy
  - Level 3: 50% accuracy
  - Level 4: 60% accuracy
  - Level 5: 70% accuracy
- Visual feedback and encouragement

### 2.3 Mathematics Module
- Numbers 1-20
- Counting objects (visual)
- Simple addition
- Interactive answer selection

### 2.4 Progress & Rewards
- Star collection
- 5-level progression
- Achievement badges
- Celebration songs
- Persistent progress

---

## 3. App Screens

1. **Welcome Screen** - App logo, Start button
2. **Language Selection** - English, Shona, or Both
3. **Home Dashboard** - Four main menu cards
4. **Reading Screen** - Letters and word categories
5. **Writing Screen** - Letter and word tracing
6. **Math Screen** - Numbers, counting, addition
7. **Rewards Screen** - Progress, achievements, songs

---

## 4. Technical Implementation

### Technology Stack
- React Native with Expo
- Expo Router for navigation
- expo-speech for Text-to-Speech
- react-native-svg for drawing
- AsyncStorage for persistence
- @expo/vector-icons for icons

### Data Storage
- All data stored locally in JSON format
- AsyncStorage for user progress
- No backend required

---

## 5. UX Principles

- Large buttons (44x44pt minimum touch targets)
- Bright, engaging colors
- Audio instructions and feedback
- Positive reinforcement only
- No penalties for wrong answers
- Encouraging retry messages

---

## 6. Word List Categories

### Family (8 words)
Amai, Baba, Mwana, Musikana, Mukomana, Sekuru, Ambuya, Hanzvadzi

### Animals (7 words)
Imbwa, Katsi, Mombe, Gwai, Mbudzi, Shiri, Hove

### School (5 words)
Chikoro, Mudzidzisi, Bhuku, Penzi, Pepa

### Food (6 words)
Mvura, Mukaka, Chingwa, Sadza, Mupunga, Chikafu

### Nature (8 words)
Zuva, Mwedzi, Nyeredzi, Moto, Mhepo, Dombo, Muti, Ruva

### Colors (7 words)
Ruvara, Tsvuku, Bhuruu, Girini, Yero, Nhema, Chena

### Actions (11 words)
Verenga, Nyora, Tamba, Mhanya, Gara, Mira, Rara, Chema, Seka, Enda, Huya

### Home (7 words)
Imba, Musuwo, Hwindo, Mubhedha, Chigaro, Tafura, Mota

---

## 7. Success Metrics

- Child can identify all 26 letters
- Child can read and pronounce basic words in both languages
- Child can trace letters and simple words
- Child can count objects 1-20
- Child can solve simple addition problems
- Child reaches Level 5 with consistent practice

---

*Document Version: 1.0*  
*Last Updated: July 2025*
