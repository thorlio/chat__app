import React from "react";

// Import React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator
const Stack = createNativeStackNavigator();

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import Screens
import Start from "./components/Start";
import Chat from "./components/Chat";

const App = () => {
  // Your Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyB9mIW9QuD2PflXOX62mBeFt2ecqFW-qOE",
    authDomain: "chatapp-e9e80.firebaseapp.com",
    projectId: "chatapp-e9e80",
    storageBucket: "chatapp-e9e80.appspot.com",
    messagingSenderId: "165400749924",
    appId: "1:165400749924:web:af86388ecacebeb166bc71",
    measurementId: "G-LYVQV5N08L",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
