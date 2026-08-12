import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";

import Carousel from "react-native-reanimated-carousel";
import { useCallback, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";

const { width, height } = Dimensions.get("window");

const BASE_URL = "http://192.168.1.6:5000";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { addToCart } = useCart();
  const { search } = useSearch(); 

  const images = [
    require("../../assets/images/1.jpeg"),
    require("../../assets/images/2.jpeg"),
    require("../../assets/images/3.jpeg"),
    require("../../assets/images/4.jpeg"),
    require("../../assets/images/5.jpg"),
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>(`${BASE_URL}/products`);
      setProducts(res.data);
    } catch (err: any) {
      console.log("Error:", err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Carousel
        loop
        width={width}
        height={height / 3}
        autoPlay
        data={images}
        renderItem={({ item }) => (
          <Image source={item} style={styles.carouselImage} />
        )}
      />

      <Text style={styles.sectionTitle}>Recommended Products</Text>

      <View style={styles.productContainer}>
        {filteredProducts.map((item) => {
          const imageUrl = `${BASE_URL}/uploads/${item.image}`;

          return (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: imageUrl }} style={styles.productImage} />

              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: width / 2 - 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    color: "#B12704",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFD814",
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
});