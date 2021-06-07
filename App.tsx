import "react-native-gesture-handler"; console.log(`started app (with${HermesInternal == null ? "out" : ""} hermes)`);
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { Component } from "react";

import SubmitScreen from "./src/SubmitScreen";
import HomeScreen from "./src/HomeScreen";
import Resources from "./src/Resources";

const Tab = createBottomTabNavigator();

export default class App extends Component<{}, {
    points: number,
    level: number,
    homeModalContent: Function,
    showHomeModal: Function
}> {
    state = {
        points: 0,
        level: 1,
        homeModalContent: () => {},
        showHomeModal: () => {}
    }

    setPoints(points: number) { this.setState({ points }); }
    getPoints() { return this.state.points; }
    setLevel(level: number) { this.setState({ level }); }
    getLevel() { return this.state.level; }
    setHomeModalContent(f: Function) { this.setState({ homeModalContent: f }); }
    setShowHomeModal(f: Function) { this.setState({ showHomeModal: f }); }

    async componentDidMount() {
        // i dont understand why but these "bind"-statements are very important for this kind of function
        this.setPoints = this.setPoints.bind(this);
        this.getPoints = this.getPoints.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.getLevel = this.getLevel.bind(this);
        this.setHomeModalContent = this.setHomeModalContent.bind(this);
        this.setShowHomeModal = this.setShowHomeModal.bind(this);

        const points = await SubmitScreen.loadData("points");
        const level = await SubmitScreen.loadData("level");

        console.log(points, level);

        points != null ? this.setState({ points: points }) : 0;
        level != null ? this.setState({ level: level }) : 0;
    }
    
    render() {
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    <Tab.Navigator
                        backBehavior="history"
                        initialRouteName="Home"
                        lazy={ false }
                        sceneContainerStyle={{ backgroundColor: Resources.colors.darkGrey }}
                        tabBarOptions={{
                            activeTintColor: Resources.colors.accent,
                            inactiveTintColor: "#fff",
                            style: { backgroundColor: Resources.colors.darkGrey, borderTopWidth: 0 }
                        }}
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName;
                                const config = (name: string, icon: string) => route.name == name ? (iconName = focused ? icon : icon + "-outline") : 0;

                                config("Eintragen", "pencil");
                                config("Home", "star");
                            
                                return <Ionicons name={ iconName as any } size={ size } color={ color }/>;
                            }
                        })}
                    >
                        <Tab.Screen
                            name="Eintragen"
                            children={ () =>
                                <SubmitScreen
                                    setPoints={ this.setPoints }
                                    getPoints={ this.getPoints }
                                    setLevel={ this.setLevel }
                                    getLevel={ this.getLevel }
                                    setHomeModalContent={ this.setHomeModalContent }
                                    showHomeModal={ this.state.showHomeModal }
                                />
                            }
                        />
                        <Tab.Screen
                            name="Home"
                            children={ () =>
                                <HomeScreen
                                    points={ this.state.points }
                                    level={ this.state.level }
                                    modalContent={ this.state.homeModalContent }
                                    setShowHomeModal={ this.setShowHomeModal }
                                />
                            }
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        );
    }
};