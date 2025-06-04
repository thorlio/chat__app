// Chat.js
import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  // Set the screen title messages
  useEffect(() => {
    navigation.setOptions({ title: name });
    //initial messages when enter in chat room
    setMessages([
      {
        _id: 1,
        text: `Welcome, ${name}! You've entered the chat.`,
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: "Hi there! This is a sample message.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chat Bot",
        },
      },
    ]);
  }, []);

  // Function to handle sending new messages
  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor || "#fff" }]}
    >
      {/*to stop keyboard overlapping textbox*/}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View style={styles.chatWrapper}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1, name: name }}
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
