import React from "react";
import {Text, View} from "react-native";
import {useQuery,gql} from "@apollo/client";

const GET_USERS  = gql`
    query Query {
        users {
            username
            id
        }
    }
`
const HireNowScreen = ({ navigation, route })=>{
    const uid = navigation.getParam('id');
    const userQuery = useQuery(GET_USERS)
    if (userQuery.loading) return <Text>Loading</Text>
   return(
       <View>
           <Text>{userQuery.data.users.length} -</Text>
           <Text>ProvidersScreen n {uid}</Text>
       </View>
   )
}

HireNowScreen.navigationOptions = {
    title: 'HireNow'
};

export default HireNowScreen