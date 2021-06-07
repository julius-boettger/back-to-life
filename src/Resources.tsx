import { StyleSheet } from "react-native";


export default class Resources {
    static fontSize = 15;

    static colors = {
        darkGrey: "#222",
        mediumGrey: "#333",
        lightGrey: "#444",
        accent: "#0f0",
        lightAccent: "#8f8"
    }

    static styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        modalView: {
            padding: 10,
            borderRadius: 5,
            backgroundColor: Resources.colors.lightGrey,
            alignItems: "center",
            width: "90%"
        }
    });
}