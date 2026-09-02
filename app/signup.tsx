import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  //View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const BASE_URL = "http://192.168.1.6:5000";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Name, Email & Password required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          mobile,
          address,
        }),
      });

      const text = await res.text(); // safer
      console.log("RAW:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response");
      }

      if (res.ok) {
        Alert.alert("Success", "Registered successfully");
        router.replace("/login");
      } else {
        Alert.alert("Error", data.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "Server not reachable\nCheck:\n• Same WiFi\n• Correct IP\n• Server running"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput placeholder="Name" style={styles.input} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <TextInput placeholder="Mobile" style={styles.input} onChangeText={setMobile} />
      <TextInput placeholder="Address" style={styles.input} onChangeText={setAddress} />

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 8 },
  btn: { backgroundColor: "#28a745", padding: 12, alignItems: "center", borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center", color: "#007bff" },
});