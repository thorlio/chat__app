import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

const Start = ({ navigation }) => {
  //state for storing user's name
  const [name, setName] = useState("");
  //state to select background color
  const [bgColor, setBgColor] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/*background image*/}
        <ImageBackground
          source={require("../assets/Background-Image.png")}
          style={styles.background}
        >
          {/*App title*/}
          <Text style={styles.title}>Catchup</Text>
          {/*white box container*/}
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
            />

            <Text style={styles.label}>Choose Background Color:</Text>
            {/*background color options*/}
            <View style={styles.whiteContainer}>
              {["#000000", "#474056", "#8A95A5", "#B9C6AE"].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    bgColor === color && styles.selected,
                  ]}
                  onPress={() => setBgColor(color)}
                />
              ))}
            </View>
            {/*navigation button to chat room*/}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Chat", { name, bgColor })}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    resizeMode: "cover",
    paddingBottom: 60,
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 20,
  },
  box: {
    width: "88%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  whiteContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
    gap: 15,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#808080",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#757083",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Start;
