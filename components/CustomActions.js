import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Asset } from "expo-asset";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  storage,
  user,
  onSend,
}) => {
  const actionSheet = useActionSheet();

  const generateStoragePath = (uri) => {
    const timeStamp = new Date().getTime();
    const fileName = uri.split("/").pop();
    return `chat/${timeStamp}-${fileName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      console.log("Uploading image from URI:", imageURI);

      const asset = Asset.fromURI(imageURI);
      await asset.downloadAsync();
      console.log("Asset localUri:", asset.localUri);

      const response = await fetch(asset.localUri);
      const blob = await response.blob();

      console.log("blob type:", blob.type);
      console.log("blob size:", blob.size);

      const storagePath = generateStoragePath(imageURI);
      console.log("STORAGE PATH for Firebase:", storagePath);

      const imageRef = ref(storage, storagePath);

      await uploadBytes(imageRef, blob, {
        contentType: "image/jpeg",
      });

      const downloadURL = await getDownloadURL(imageRef);

      console.log("Image uploaded. URL:", downloadURL);

      onSend([
        {
          _id: new Date().getTime().toString(),
          createdAt: new Date(),
          user: user,
          image: downloadURL,
        },
      ]);
    } catch (error) {
      console.error("Upload error full:", JSON.stringify(error, null, 2));
      console.log("serverResponse:", error?.serverResponse);
      Alert.alert("Upload Failed", error.message);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied for image library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      await uploadAndSendImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied for camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      await uploadAndSendImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied for location.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      onSend([
        {
          _id: new Date().getTime().toString(),
          createdAt: new Date(),
          user: user,
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        },
      ]);
    }
  };

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage();
            break;
          case 1:
            await takePhoto();
            break;
          case 2:
            await getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="More actions"
      accessibilityHint="Send an image or location"
      accessibilityRole="button"
    >
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
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
