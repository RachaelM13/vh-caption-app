import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, Image, SafeAreaView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  // define state variables for the image and caption
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  // access the camera roll
  const pickImageGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      getCaption(result.assets[0].base64);
      setImage(result.assets[0].uri);
    }
  };

  // access the camera to take a picture
  const pickImageCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      getCaption(result.assets[0].base64);
      setImage(result.assets[0].uri);
    }
  };

  // generate a caption via an API
  const getCaption = async (base64Image) => {
    const url = process.env.EXPO_PUBLIC_API_URL;
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.EXPO_PUBLIC_API_KEY,
        "x-rapidapi-host": "image-caption-generator2.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: base64Image,
      }),
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setCaption(result.caption || "No caption generated");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text1}>Generated Caption:</Text>
      <Text style={styles.text1}>{caption}</Text>
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 400,
            height: 300,
            objectFit: "contain",
          }}
        />
      )}
      <Button title="Pick an image from gallery" onPress={pickImageGallery} />
      <Button title="Pick an image from camera" onPress={pickImageCamera} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    height: "100%",
  },
  text1: {
    fontSize: 23,
    margin: "0 20px, 0, 0px",
    color: "black",
    fontWeight: "bold",
  },
});
