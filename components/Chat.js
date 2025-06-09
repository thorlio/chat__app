// // Chat.js
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Platform,
//   KeyboardAvoidingView,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import { GiftedChat } from "react-native-gifted-chat";

// const Chat = ({ route, navigation }) => {
//   const { name, bgColor } = route.params;

//   const [messages, setMessages] = useState([]);

//   // Set the screen title messages
//   useEffect(() => {
//     navigation.setOptions({ title: name });
//     //initial messages when enter in chat room
//     setMessages([
//       {
//         _id: 1,
//         text: `Welcome, ${name}! You've entered the chat.`,
//         createdAt: new Date(),
//         system: true,
//       },
//       {
//         _id: 2,
//         text: "Hi there! This is a sample message.",
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: "Chat Bot",
//         },
//       },
//     ]);
//   }, []);

//   // Function to handle sending new messages
//   const onSend = (newMessages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, newMessages)
//     );
//   };

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: bgColor || "#fff" }]}
//     >
//       {/*to stop keyboard overlapping textbox*/}
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
//       >
//         <View style={styles.chatWrapper}>
//           <GiftedChat
//             messages={messages}
//             onSend={onSend}
//             user={{ _id: 1, name: name }}
//             bottomOffset={Platform.OS === "android" ? 20 : 0}
//             placeholder="Type your message..."
//           />
//           <View style={styles.spacer} />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   chatWrapper: {
//     flex: 1,
//   },
//   spacer: {
//     height: Platform.OS === "android" ? 10 : 10,
//   },
// });

// export default Chat;

import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { GiftedChat, Composer } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { name, bgColor } = route.params;

  // Declare message state
  const [messages, setMessages] = useState([]);

  // Read from Firestore in real-time using onSnapshot
  useEffect(() => {
    navigation.setOptions({ title: name });

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
      setMessages(newMessages);
    });

    // Cleanup listener
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
