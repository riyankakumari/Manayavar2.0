import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/authContext";
import { SearchProvider } from "../context/SearchContext"; 

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Stack screenOptions={{ headerShown: false }} />
          
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}