import React, { Component } from "react";
import {
    View,
    Text,
    Pressable
} from "react-native";

import Resources from "./Resources";

export default class BetterButton extends Component<{
    text: string,
    onPress: any,
    color?: string,
    disabled?: boolean,
    padding?: number,
    fontSize?: number
}, {}> {
    render() {
        const x = {
            borderRadius: 5,
            backgroundColor: this.props.color == undefined ? Resources.colors.mediumGrey : this.props.color,
            padding: this.props.padding == undefined ? 10 : this.props.padding,
            margin: 5,
            marginBottom: 0
        }
        return (
            <View style={ x }>
                <Pressable
                    android_ripple={{ color: Resources.colors.accent, borderless: true, radius: 500 }}
                    onPress={ this.props.onPress }
                    disabled={ this.props.disabled }
                >
                    <Text style={{
                        fontSize: this.props.fontSize == undefined ? Resources.fontSize : this.props.fontSize,
                        color: this.props.disabled ? "#888" : "#fff",
                        textAlign: "center"
                    }}>
                        { this.props.text }
                    </Text>
                </Pressable>
            </View>
        );
    }
}