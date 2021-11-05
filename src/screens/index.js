import React from 'react';
import { Text, View, ScrollView, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {exp} from "react-native-reanimated";
import MyProfileScreen from "./my_profile_screen";
import FindJobScreen from "./service_provider/FindJobScreen";
import RequestersScreen from "./requesters_screen";
import ProvidersByProfession from "./providersByProfession"
import AuthLoading from "./auth_loading";
import SignIn from "./signin";
import SignUp from "./signup";
import HireNow from './hireNow';
import HireNowScreen from './hireNow';
import Success from './successful';
import RequesterStatus from './requester_status_screen';
import ProviderStatus from './provider_status_screen';
import Request from './request_screen';
import Accept from './accept_screen';
import ProviderReview from './provider_review_screen';
import RequesterReview from './requester_review_screen';
import ServiceProviderAuth from "./service_provider/service_provider_auth";
import ServiceProviderReject from "./service_provider/service_provider_reject";
import JobPostingScreen from "./service_provider/JobPostingScreen";

const ProviderStack = createStackNavigator({
    FindJob:FindJobScreen,
    JobPosting:JobPostingScreen
});

const MyStack = createStackNavigator({
    MyProfile: MyProfileScreen,
    ProviderStatus:ProviderStatus,
    RequesterStatus:RequesterStatus,
    Request:Request,
    Accept:Accept,
    ProviderReview:ProviderReview,
    RequesterReview:RequesterReview,
    
});


const RequesterStack = createStackNavigator({
    Requesters: RequestersScreen,
    ProvidersByProfession:ProvidersByProfession,
    HireNow:HireNow,
    Success:Success

});



const ServiceProviderSwitchNavigator = createSwitchNavigator(
    {
        ServiceProviderAuth:ServiceProviderAuth,
        ServiceProviderReject:ServiceProviderReject,
        ServiceProviderStack:ProviderStack
    },{
        initialRouteName:"ServiceProviderAuth"
    }
)

const TabNavigator = createBottomTabNavigator({

    MyNoteScreen: {
        screen: MyStack,
        navigationOptions: {
            tabBarLabel: 'My Profile',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="face-profile" size={24} color={tintColor} />
            )
        }
    },
    Provider: {
        screen: ServiceProviderSwitchNavigator,
        navigationOptions: {
            tabBarLabel: 'Find Job',
            tabBarIcon: ({ tintColor }) => (
                <MaterialCommunityIcons name="tools" size={24} color={tintColor} />
            )
        }
    },
    Requesting: {
        screen: RequesterStack,
        navigationOptions: {
            tabBarLabel: 'Request',
            tabBarIcon: ({ tintColor }) => (
                <MaterialIcons name="design-services" size={24} color="black" />
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