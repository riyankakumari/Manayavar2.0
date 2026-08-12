import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import Header from "../../components/header";
import { useCart } from "../../context/CartContext";

export default function TabLayout() {
  const { cart } = useCart();

  //  Total quantity
  const cartCount = cart.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: "#FFD814",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#25292e",
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Cart with Badge */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart" color={color} size={size} />

              {cartCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "red",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    minWidth: 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      {/* Add Product */}
      <Tabs.Screen
        name="addProducts"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      {/* About */}
      {/* <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle"
              color={color}
              size={size}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}