import { Text, View, StyleSheet } from "react-native";
//import { Link, Stack } from "expo-router";

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Edit app/about.tsx to edit this screen.</Text>
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
    }
})
