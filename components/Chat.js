import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
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

const Chat = ({ route, navigation, db, isConnected }) => {
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
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
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
      text: msg.text,
      createdAt: msg.createdAt,
      user: msg.user,
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor || "#fff" }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View style={styles.chatWrapper}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: name || 1, name: name }}
            bottomOffset={Platform.OS === "android" ? 20 : 0}
            placeholder="Type your message..."
            renderInputToolbar={renderInputToolbar}
          />
          <View style={styles.spacer} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
