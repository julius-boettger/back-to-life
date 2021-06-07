import { AnimatedCircularProgress } from "react-native-circular-progress";
import React, { Component } from "react";
import {
    View,
    Text,
    Modal
} from "react-native";

import Resources from "./Resources";
import BetterButton from "./BetterButton";

export default class HomeScreen extends Component<{

    points: number,
    level: number,
    modalContent: Function,
    setShowHomeModal: Function

}, { modalVisible: boolean }> {

    state = { modalVisible: false }

    toggleModal = () => this.setState({ modalVisible: !this.state.modalVisible });

    constructor(props: any) {
        super(props);
        this.props.setShowHomeModal(() => this.setState({ modalVisible: true }));
    }

    render() {
        return (
            <View style={ Resources.styles.centeredView }>
                <Modal
                    animationType="slide"
                    transparent={ true }
                    visible={ this.state.modalVisible }
                    onRequestClose={ this.toggleModal }
                >
                    <View style={Resources.styles.centeredView}>
                        <View style={Resources.styles.modalView}>
                            { this.props.modalContent() }
                            <BetterButton
                                text="Schließen"
                                onPress={ this.toggleModal }
                                color={ Resources.colors.darkGrey }
                            />
                        </View>
                    </View>
                </Modal>
                <AnimatedCircularProgress
                    size={ 300 }
                    width={ 5 }
                    backgroundWidth={ 10 }
                    arcSweepAngle={ 270 }
                    duration={ 2000 }
                    rotation={ -135 }
                    fill={ this.props.points / 10 }
                    tintColor={ Resources.colors.accent }
                    backgroundColor={ Resources.colors.lightGrey }
                >
                    {
                        () => (
                            <View>
                                <Text style={{ fontSize: 35, color: Resources.colors.lightAccent, textAlign: "center" }}>{ this.props.points } Punkte</Text>
                                <Text style={{ fontSize: 15, color: "#aaa", textAlign: "center"}}>Noch { 1000 - this.props.points } bis zum </Text>
                                <Text style={{ fontSize: 15, color: "#aaa", textAlign: "center"}}>nächsten Level!</Text>
                            </View>
                        )
                    }
                </AnimatedCircularProgress>
                <Text style={{ fontSize: 40, color: Resources.colors.accent }}>Level { this.props.level }</Text>
            </View>
        );
    }
}