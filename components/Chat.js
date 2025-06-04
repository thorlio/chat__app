// Chat.js
import React, { useState, useEffect } from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  // Set the screen title messages
  useEffect(() => {
    navigation.setOptions({ title: name });

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
          name: "React Native Bot",
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
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Gifted Chat UI */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          name: name,
        }}
      />

      {/* Prevent keyboard from covering input on iOS/Android */}
      {Platform.OS === "android" || Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
