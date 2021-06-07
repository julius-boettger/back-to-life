import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
    View,
    Text,
    Modal,
    Image
} from "react-native";

import Resources from "./Resources";
import BetterButton from "./BetterButton";
import Picker from "./Picker";
import { ImageInfo } from "./ImageInfo";

const getYesterday = () => ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][new Date().getDay() == 0 ? 6 : (new Date().getDay() - 1)];

export default class SubmitScreen extends Component<{
    setPoints: Function,
    getPoints: Function,
    setLevel: Function,
    getLevel: Function,
    setHomeModalContent: Function,
    showHomeModal: Function
}, {
    canSubmit: boolean,
    modalVisible: boolean,
}> {
    state = {
        canSubmit: true,
        modalVisible: false,
    }

    // returns null if key doesnt exist
    static loadData = async (key: string) => { return JSON.parse(await AsyncStorage.getItem(key) as string); }
    static saveData = async (key: string, value: any) => { await AsyncStorage.setItem(key, JSON.stringify(value)); }

    toggleModal = () => this.setState({ modalVisible: !this.state.modalVisible });

    getPicker: Function[] = [];

    nextImage = -1;

    createPicker(index: number, text: string) {
        return (
            <>
                <Text style={{
                    fontSize: Resources.fontSize,
                    textAlign: "center",
                    marginBottom: 3,
                    marginTop: index == 0 ? 0 : 20
                }}>
                    { text }
                </Text>
                <Picker getSelected={ (x: Function) => this.getPicker[index] = x }/>
            </>
        );
    }

    // called just once on app start
    async componentDidMount() {
        // DEBUG sets storage to specific values on start
        //await AsyncStorage.clear();
        //await SubmitScreen.saveData("lastRecordedDay", "");
        //await SubmitScreen.saveData("points", 0);
        //await SubmitScreen.saveData("level", 1)
        //await SubmitScreen.saveData("nextImage", -1);
        
        // if level has not been set yet => only happens when the app is first opened
        if (await SubmitScreen.loadData("level") == null) {
            // user gets a welcome message, initialize important variables in the storage
            await SubmitScreen.saveData("lastRecordedDay", "");
            await SubmitScreen.saveData("level", 1);
            await SubmitScreen.saveData("points", 0);
            await SubmitScreen.saveData("nextImage", -1);
            this.setState({ canSubmit: true });
            this.props.setHomeModalContent(() => (
                <>
                    <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 3 }}>Willkommen!</Text>
                    <Text style={{ fontSize: Resources.fontSize, textAlign: "center" }}>
                        In dieser App kannst du einmal täglich selbst reflektieren, wie du dich gestern verhalten hast.
                        Je nach Verhalten bekommst du Punkte und steigst Level auf, worauf du stolz sein kannst, denn durch
                        häufiges Händewaschen, Abstandhalten, Maske-Tragen und Kontakte-Reduzieren rettest du buchstäblich
                        Leben! Ich hoffe diese App kann dir ein bisschen Motivation dafür geben, dich an solche Regelungen zu
                        halten, indem sie dir zeigt, wie wichtig das ist! { "\n\n" }
                        So, jetzt aber genug Text, geh doch mal links unten auf "Eintragen" und fang' gleich an! (Der Knopf 
                        "Sehr gut" ist übrigens nur für den Fall, dass du z.B. freiwillig mehr deine Maske getragen hast, als
                        von dir erwartet wurde, der Durchschnitt sollte "Normal" sein) { "\n\n" }
                        Viel Spaß! :)
                    </Text>
                </>
            ));
            this.props.showHomeModal();
        } else { // if this is not the first time opening the app 
            this.setState({ canSubmit: (await SubmitScreen.loadData("lastRecordedDay") == getYesterday() ? false : true) });
            this.nextImage = (await SubmitScreen.loadData("nextImage"));
        }
    }

    render() {
        return (
            <View style={ Resources.styles.centeredView }>
                <BetterButton
                    text={"Punkte für gestern\n(" + getYesterday() + ") sammeln"}
                    onPress={ () => this.toggleModal() }
                    disabled={ !this.state.canSubmit }
                    padding={ 30 }
                    fontSize={ 20 }
                />
                <Text style={{
                    fontSize: Resources.fontSize,
                    padding: 30,
                    position: "absolute",
                    bottom: 0,
                    color: (this.state.canSubmit ? Resources.colors.darkGrey : "#aaa"),
                    textAlign: "center"
                }}>
                    (Du hast dein gestriges { "\n" } Verhalten bereits aufgezeichnet)
                </Text>
                <Modal
                    animationType="slide"
                    transparent={ true }
                    visible={ this.state.modalVisible }
                    onRequestClose={ this.toggleModal }
                >
                    <View style={ Resources.styles.centeredView }>
                        <View style={ Resources.styles.modalView }>
                            { this.createPicker(0, "So habe ich mich an die Kontaktbeschränkungen gehalten:") }
                            { this.createPicker(1, "So habe ich mich an die Abstandsregeln gehalten:") }
                            { this.createPicker(2, "So habe ich mich an das Händewaschen und Desinfizieren gehalten:") }
                            { this.createPicker(3, "So habe ich mich an das Maske tragen gehalten:") }
                            <View style={{ flexDirection: "row" }}>
                                <BetterButton
                                    text="Abbrechen"
                                    onPress={ this.toggleModal }
                                    color={ Resources.colors.darkGrey }
                                />
                                <BetterButton
                                    text="Weiter"
                                    color={ Resources.colors.darkGrey }
                                    onPress={ async () => {
                                        this.setState({ canSubmit: false });

                                        let points: number = 0;
                                        for (let f of this.getPicker) {
                                            switch (f()) {
                                                case 0:
                                                    points += 250;
                                                    break;
                                                case 1:
                                                    points += 100;
                                                    break;
                                                case 2:
                                                    points += 25;
                                                    break;
                                            }
                                        }

                                        let levelUp = false;
                                        let displayText = "";

                                        if (points >= 550)
                                            displayText += "Sehr gut! ";
                                        else if (points >= 400)
                                            displayText += "Gut gemacht! ";

                                        if (points > 100)
                                            displayText += "Du hast " + points + " Punkte erhalten! ";
                                        else
                                            displayText += "Du hast leider nur " + points + " Punkte erhalten... Gib' heute alles um morgen mehr Punkte zu kassieren! ";

                                        if (points > 0 && Math.random() <= 0.14) {
                                            displayText += "\n\nGestern war übrigens ein Bonus-Tag, also bekommst du nochmal " + points + " Punkte! Herzlichen Glückwunsch!\n\n";
                                            points *= 2;
                                        }

                                        const extraLevel = Math.floor((this.props.getPoints() + points) / 1000);
                                        const newLevel = this.props.getLevel() + extraLevel;
                                        const newPoints = (this.props.getPoints() + points) - (extraLevel * 1000);

                                        if (this.props.getPoints() + points >= 1000) {
                                            levelUp = true;
                                            this.nextImage += 1;
                                            if (this.nextImage == 32)
                                                this.nextImage = 0;
                                            await SubmitScreen.saveData("nextImage", this.nextImage);

                                            displayText += "Damit bist du auf Level " + newLevel + " aufgestiegen!\n\n" + ImageInfo[ this.nextImage ][1];

                                            this.props.setLevel(newLevel);
                                            this.props.setPoints(newPoints);
                                        } else {
                                            displayText += "(Jetzt fehlen nur noch " + (1000 - newPoints) + " Punkte bis zum nächsten Level)";
                                            this.props.setPoints(newPoints);
                                        }

                                        this.props.setHomeModalContent(() =>
                                            <>
                                                <Text style={{ fontSize: Resources.fontSize, textAlign: "center" }}>{ displayText }</Text>
                                                {(() => { if (levelUp) return (
                                                    <Image
                                                        source={ ImageInfo[ this.nextImage ][0] }
                                                        style={{
                                                            width: 300,
                                                            height: 300 * 0.75,
                                                            marginTop: 10
                                                        }}
                                                    />
                                                )})()}
                                            </>
                                        );
                                                        
                                        this.toggleModal();
                                        this.props.showHomeModal();

                                        await SubmitScreen.saveData("lastRecordedDay", getYesterday());
                                        await SubmitScreen.saveData("nextImage", this.nextImage);
                                        await SubmitScreen.saveData("points", newPoints);
                                        await SubmitScreen.saveData("level", newLevel);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}