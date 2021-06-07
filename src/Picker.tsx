import Ionicons from "react-native-vector-icons/Ionicons";
import React, { Component } from "react";
import {
    View,
    Text
} from "react-native";

import Resources from "./Resources";

export default class Picker extends Component<{ getSelected: Function }, { selected: number }> {
    state = { selected: 1 }

    constructor(props: any) {
        super(props);
        this.props.getSelected(() => this.state.selected);
    }

    createPickerItem(index: number, color: string, backgroundColor: string, text: string) {
        return (
            <Text
                style={{
                    fontSize: Resources.fontSize,
                    textAlign: "center",
                    width: "48%",
                    color,
                    backgroundColor,
                    margin: 3,
                    borderRadius: 3,
                    padding: 3
                }}
                onPress={() => this.setState({ selected: index })}
            >
                { text }
                {(() => { if (this.state.selected == index) return (
                    <Ionicons name="checkmark" size={ Resources.fontSize } color={ color }/>
                )})()}
            </Text>
        );
    }

    render() {
        return (
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap"
            }}>
                { this.createPickerItem(0, "#000", "#0f0", "Sehr gut") }
                { this.createPickerItem(1, "#000", "#ff0", "Normal") }
                { this.createPickerItem(2, "#000", "#f70", "Nicht so gut") }
                { this.createPickerItem(3, "#fff", "#f00", "Gar nicht") }
            </View>
        );
    }
}