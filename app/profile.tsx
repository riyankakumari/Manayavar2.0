import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect safely using useEffect
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user.name}</Text>
      {/* <Text style={styles.title}>My Profile</Text> */}

      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Address: {user.address}</Text>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => router.push("/logout")}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
  text: { fontSize: 16, marginBottom: 10 },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});