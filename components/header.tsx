import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/authContext";
import { useSearch } from "../context/SearchContext";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const { setSearch } = useSearch();

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>MANYAVAR</Text>

      <View style={styles.rightSection}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#000" />
          <TextInput
            placeholder="Search..."
            style={styles.input}
            onChangeText={setSearch}
          />
        </View>

        {/* PROFILE / LOGIN */}
        {user ? (
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="person" size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFD814",
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  input: {
    marginLeft: 5,
    width: 120,
  },
  loginBtn: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  loginText: {
    color: "#fff",
  },
});