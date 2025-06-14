# Chat App (React Native with Firebase)

This is a mobile chat application built with React Native using the Expo framework. It supports sending text messages, sharing photos, and sending current location data using Firebase Firestore and Expo libraries. Offline message caching is supported through AsyncStorage.

## Setup Instructions

### 1. Install Expo CLI

Make sure you have Node.js installed. Then install Expo CLI globally:

```bash
npm install -g expo-cli
```

### 2. Clone the Repository

```bash
git clone https://github.com/thorlio/chat__app.git
cd chat__app
```

### 3. Install Project Dependencies

```bash
npm install
```

### 4. Firebase Configuration

- Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Create a new Firebase project
- Enable **Cloud Firestore**
- Enable **Anonymous Authentication**
- Copy your Firebase config from the project settings

Paste your Firebase config directly into `App.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

### 5. Start the App

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or run it on an emulator.

## Features

- Real-time chat using Firebase Firestore
- Anonymous user authentication
- Offline caching with AsyncStorage
- Send and view photos
- Send and display user location on a map
- Custom action sheet with options to attach media or location

## Required Libraries

These libraries are required and should already be installed:

- firebase
- react-native-gifted-chat
- @react-native-async-storage/async-storage
- expo-image-picker
- expo-location
- react-native-maps
- @expo/react-native-action-sheet
- @react-navigation/native
- @react-navigation/native-stack
