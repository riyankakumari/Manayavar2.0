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

import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import RNFS from 'react-native-fs';

const BASE_URL = "http://192.168.1.6:5000";

export default function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<any>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add / Update Product
  const uploadProduct = async () => {
    if (!name || !price || (!image && !editingId)) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: "product.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      const url = editingId
        ? `${BASE_URL}/product/${editingId}`
        : `${BASE_URL}/add-product`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      Alert.alert("Success", data.message);

      setName("");
      setPrice("");
      setImage(null);
      setEditingId(null);

      fetchProducts();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Upload failed");
    }
  };

  //  Delete Product
  const deleteProduct = (id: number) => {
    Alert.alert("Confirm", "Delete this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await fetch(`${BASE_URL}/product/${id}`, {
            method: "DELETE",
          });
          fetchProducts();
        },
      },
    ]);
  };

  // Edit Product
  const editProduct = (item: any) => {
    setName(item.name);
    setPrice(item.price.toString());
    setImage(null);
    setEditingId(item.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {editingId ? "Update Product" : "Add Product"}
      </Text>

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
        <Text>{image ? "Change Image" : "Pick Image"}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.button} onPress={uploadProduct}>
        <Text style={styles.buttonText}>
          {editingId ? "Update Product" : "Upload Product"}
        </Text>
      </TouchableOpacity>

      {/* Product List */}
      <Text style={styles.sectionTitle}>Products</Text>

      {products.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image
            source={{
              uri: `${BASE_URL}/uploads/${item.image}`,
            }}
            style={styles.cardImage}
            onError={() =>
              console.log("Image error:", `${BASE_URL}/uploads/${item.image}`)
            }
          />

          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.price}>₹ {item.price}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => editProduct(item)}
            >
              <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteProduct(item.id)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
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
    height: 250,
    marginBottom: 15,
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  price: {
    marginTop: 2,
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  editBtn: {
    backgroundColor: "#ffc107",
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
  },

  deleteBtn: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
    marginLeft: 190,
  },
});