import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "http://192.168.1.6:5000";

export default function AddProducts() {
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<any>(null);

  // Pick Image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  //  Upload Product
  const uploadProduct = async () => {
    if (!name || !price || !image) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);

    formData.append("image", {
      uri: image.uri,
      name: "product.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const res = await fetch(`${BASE_URL}/add-product`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      Alert.alert("Success", data.message);

      // Reset form
      setName("");
      setPrice("");
      setImage(null);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Upload failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text>
          {image ? "Change Image" : "Pick Image"}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.button} onPress={uploadProduct}>
        <Text style={styles.buttonText}>Upload Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },

  imagePicker: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  preview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});