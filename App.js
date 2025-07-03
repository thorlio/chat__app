import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

// Screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// Modular Firebase import
import { db, storage } from "./firebase";
import { disableNetwork, enableNetwork } from "firebase/firestore";

const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  // Handle network status
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              {...props}
              db={db}
              storage={storage}
              isConnected={connectionStatus.isConnected}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
