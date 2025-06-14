import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

// custom actions for images, camera location
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  // choose images from device
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        onSend([
          {
            _id: new Date().getTime(),
            createdAt: new Date(),
            user: { _id: 1 },
            image: result.assets[0].uri,
          },
        ]);
      }
    } else {
      Alert.alert("Permission to access gallery was denied");
    }
  };

  // open camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        onSend([
          {
            _id: new Date().getTime(),
            createdAt: new Date(),
            user: { _id: 1 },
            image: result.assets[0].uri,
          },
        ]);
      }
    } else {
      Alert.alert("Permission to access camera was denied");
    }
  };

  // get location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend([
          {
            _id: new Date().getTime(),
            createdAt: new Date(),
            user: { _id: 1 },
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        ]);
      }
    } else {
      Alert.alert("Permission to access location was denied");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
