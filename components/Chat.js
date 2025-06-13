import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, bgColor } = route.params;

  // State to store messages
  const [messages, setMessages] = useState([]);

  // Set chat room screen title and load messages
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let newMessages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newMessages.push({
            _id: doc.id,
            text: data.text || "",
            createdAt: data.createdAt.toDate(),
            user: data.user,
            image: data.image || null,
            location: data.location || null,
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      loadCachedMessages();
    }
  }, [isConnected]);

  // Write new messages to Firestore
  const onSend = async (newMessages = []) => {
    const msg = newMessages[0];
    await addDoc(collection(db, "messages"), {
      text: msg.text || "",
      createdAt: msg.createdAt,
      user: msg.user,
      image: msg.image || null,
      location: msg.location || null,
    });
  };

  // Save messages locally
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Load messages from local storage
  const loadCachedMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("messages");
      if (storedMessages) setMessages(JSON.parse(storedMessages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hide input toolbar
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Render action button
  const renderCustomActions = (props) => {
    return (
      <CustomActions
        storage={storage}
        onSend={onSend}
        userID={name || "user"}
        {...props}
      />
    );
  };

  // Render map
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: bgColor || "#fff" }]}
      >
        <View style={styles.chatWrapper}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: name || 1, name: name }}
            bottomOffset={Platform.OS === "android" ? 20 : 0}
            placeholder="Type your message..."
            renderInputToolbar={renderInputToolbar}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
          />
          <View style={styles.spacer} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
  },
  spacer: {
    height: Platform.OS === "android" ? 10 : 10,
  },
});

export default Chat;
