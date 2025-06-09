import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { name, bgColor } = route.params;

  // State to store messages
  const [messages, setMessages] = useState([]);

  // Set chat room screen title
  useEffect(() => {
    navigation.setOptions({ title: name });

    //reference to messages collection
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    //real time listener
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
      setMessages(newMessages);
    });

    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Write new messages to Firestore
  const onSend = async (newMessages = []) => {
    const msg = newMessages[0];
    await addDoc(collection(db, "messages"), {
      text: msg.text,
      createdAt: msg.createdAt,
      user: msg.user,
    });
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
