import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Link href={"/"} style={styles.button}>Go back to Home screen!</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e"
  },
  text: {
    color: "white",
  },
  button: {
    color: "aqua",
    fontSize: 20,
    textDecorationLine: "underline",
  }
})
