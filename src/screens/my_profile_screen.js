import React from "react";
import {Text,View,Button} from "react-native";
import * as SecureStore from "expo-secure-store";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../gql/query";
import {Box} from "@jrobins/bulma-native"

const MyProfileScreen = (props)=>{
    const signOut = () => {
        SecureStore.deleteItemAsync('token').then(
            props.navigation.navigate('Auth')
        );
    };
    const meQuery = useQuery(GET_ME)
    if(meQuery.loading) return <Text>Loading</Text>
    if(meQuery.error) return <Text>Error</Text>
    return(
        <View>
                <Text>{meQuery.data.me.fullname}</Text>
                <Text>{meQuery.data.me.username}</Text>
                <Button title="Sign Out" onPress={signOut} />
        </View>
    )
}
export default MyProfileScreen