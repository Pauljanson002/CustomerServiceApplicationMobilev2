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
const ProvidersByProfessionScreen = ()=>{
    const userQuery = useQuery(GET_USERS)
    if (userQuery.loading) return <Text>Loading</Text>
   return(
       <View>
           <Text>{userQuery.data.users.length}</Text>
           <Text>ProvidersScreen</Text>
       </View>
   )
}
export default ProvidersByProfessionScreen