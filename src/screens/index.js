import React from 'react';
import { Text, View, ScrollView, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {exp} from "react-native-reanimated";
import MyProfileScreen from "./my_profile_screen";
import ProvidersScreen from "./providers_screen";
import AuthLoading from "./auth_loading";
import SignIn from "./signin";
import SignUp from "./signup";

const ProviderStack = createStackNavigator({
    Providers:ProvidersScreen
});

const MyStack = createStackNavigator({
    MyProfile: MyProfileScreen,
});

const TabNavigator = createBottomTabNavigator({

    MyNoteScreen: {
        screen: MyStack,
        navigationOptions: {
            tabBarLabel: 'My Notes',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="notebook" size={24} color={tintColor} />
            )
        }
    },
    Settings: {
        screen: ProviderStack,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="settings" size={24} color={tintColor} />
            )
        }
    }
});
const AuthStack = createStackNavigator({
    SignIn: SignIn,
    SignUp: SignUp
});

const SwitchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        App: TabNavigator
    },
    {
        initialRouteName: 'AuthLoading'
    }
);


export default createAppContainer(SwitchNavigator);