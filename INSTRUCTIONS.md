# Tanga Kudzidza / Start Learning App

A bilingual (Shona & English) educational app for children aged 3-5 years, built with React Native (Expo).

**Developed by: SCW Digital**  
**Contact: +263 78 709 0543**

## Features

### 1. Reading Module (Kuverenga)
- Learn letters A-Z with audio pronunciation
- Learn 59+ Shona-English word pairs across 8 categories:
  - Family (Mhuri)
  - Animals (Mhuka)
  - School (Chikoro)
  - Food (Chikafu)
  - Nature (Sango)
  - Colors (Mavara)
  - Actions (Zviito)
  - Home (Kumba)
- Audio pronunciation using Text-to-Speech
- Progress tracking for completed letters and words

### 2. Writing Module (Kunyora)
- Trace letters A-Z
- Trace simple words
- Progressive difficulty based on level:
  - Level 1: 30% accuracy required
  - Level 5: 70% accuracy required
- Visual feedback with drawing canvas
- Encouragement for kids who need multiple attempts

### 3. Mathematics Module (Masvomhu)
- Numbers 1-20 with audio
- Counting exercises with visual objects
- Simple addition problems
- Interactive answer selection
- Audio feedback for correct/incorrect answers

### 4. Rewards & Progress
- Star collection system
- 5-level progression system
- Achievement badges for completing categories
- Celebration songs unlocked at each level
- Progress persistence using AsyncStorage

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Audio**: expo-speech (Text-to-Speech)
- **Drawing**: react-native-svg + react-native-gesture-handler
- **Storage**: @react-native-async-storage/async-storage
- **UI Components**: @expo/vector-icons (Ionicons)
- **Animations**: react-native-reanimated

## Running Locally

### Prerequisites
- Node.js 18+ installed
- Yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation Steps

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
yarn install

# 3. Start the development server
yarn start
# OR
npx expo start

# 4. For web preview
yarn web
# OR
npx expo start --web

# 5. For iOS simulator (Mac only)
yarn ios
# OR
npx expo start --ios

# 6. For Android emulator
yarn android
# OR
npx expo start --android
```

### Testing on Physical Device

1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Run `yarn start` or `npx expo start`
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

## Deployment

### Building for Production

#### Using EAS Build (Recommended)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo account
eas login

# 3. Configure the project
eas build:configure

# 4. Build for iOS
eas build --platform ios

# 5. Build for Android
eas build --platform android

# 6. Build for both platforms
eas build --platform all
```

#### Using Expo Build (Legacy)

```bash
# Build for Android (APK)
expo build:android -t apk

# Build for iOS (requires Apple Developer account)
expo build:ios
```

### Web Deployment

```bash
# 1. Build for web
npx expo export --platform web

# 2. The output will be in 'dist' folder
# Deploy to any static hosting service:
# - Netlify
# - Vercel
# - Firebase Hosting
# - GitHub Pages
```

### App Store Submission

#### iOS (App Store)
1. Build using EAS: `eas build --platform ios`
2. Submit using: `eas submit --platform ios`
3. Requires Apple Developer account ($99/year)

#### Android (Play Store)
1. Build AAB: `eas build --platform android --profile production`
2. Submit using: `eas submit --platform android`
3. Requires Google Play Developer account ($25 one-time)

## Project Structure

```
frontend/
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Welcome screen
│   ├── language.tsx        # Language selection
│   ├── home.tsx            # Home dashboard
│   ├── reading.tsx         # Reading module
│   ├── writing.tsx         # Writing/tracing module
│   ├── math.tsx            # Mathematics module
│   └── rewards.tsx         # Rewards & achievements
├── src/
│   ├── components/         # Reusable components
│   │   ├── Logo.tsx
│   │   ├── ProgressBar.tsx
│   │   └── SuccessModal.tsx
│   ├── context/            # React Context for state
│   │   └── AppContext.tsx
│   └── data/               # Static data (JSON)
│       ├── words.ts        # Shona-English word list
│       └── math.ts         # Math problems
├── assets/                 # Images and fonts
├── app.json                # Expo configuration
└── package.json            # Dependencies
```

## Data Storage

All data is stored locally using AsyncStorage:
- Language preference
- Progress (stars, level, completed items)
- No backend required - fully offline capable

## Customization

### Adding New Words
Edit `/src/data/words.ts` and add to the `words` array:

```typescript
{ 
  id: 'w60', 
  english: 'NewWord', 
  shona: 'ShonaWord', 
  meaning: 'Definition', 
  category: 'family' 
}
```

### Adding Math Problems
Edit `/src/data/math.ts` and add to the `mathProblems` array.

### Changing Colors
Main colors used:
- Primary Blue: #2196F3
- Success Green: #4CAF50
- Warning Orange: #FF9800
- Purple: #9C27B0
- Background: #E3F2FD

## Support

**SCW Digital**
Phone: +263 78 709 0543

---

*Tanga Kudzidza - Helping children learn Shona & English!*
