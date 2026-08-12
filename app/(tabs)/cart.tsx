import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { useCart } from "../../context/CartContext";

const BASE_URL = "http://192.168.1.6:5000";

export default function CartScreen() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const imageUrl = `${BASE_URL}/uploads/${item.image}`;

              return (
                <View style={styles.card}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />

                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>

                    {/* TOTAL PRICE */}
                    <Text style={styles.price}>
                      ₹{item.price * item.quantity}
                    </Text>

                    {/* MULTIPLY VIEW */}
                    <Text style={styles.subText}>
                      ₹{item.price} × {item.quantity}
                    </Text>

                    {/* Quantity Controls */}
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => decreaseQty(item.id)}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qty}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => increaseQty(item.id)}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* DELETE BUTTON (NOW WORKS) */}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Text style={{ color: "#fff" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          {/* TOTAL */}
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>
              Total: ₹{total}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 10,
  },

  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  empty: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 16,
    color: "#B12704",
    fontWeight: "bold",
  },

  subText: {
    fontSize: 12,
    color: "gray",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  qtyBtn: {
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 5,
  },

  qty: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },

  removeBtn: {
    backgroundColor: "#dc3545",
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },

  totalBox: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
  },

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});