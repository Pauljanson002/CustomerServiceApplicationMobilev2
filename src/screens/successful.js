import React from "react";
import {Text, View,StyleSheet} from "react-native";
import {useQuery,gql} from "@apollo/client";
import { AntDesign } from '@expo/vector-icons';

const SuccessfulScreen = ()=>{
    
    
   return(
    <View style={styles.container}>
           <AntDesign name="checkcircle" size={35} color="#4ade80" />
           <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', margin:20 }}>
        Succesful!
      </Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' ,color: '#60a5fa', margin:5}}>
         You can check the status of the request on your profile
      </Text>
       </View>
   )
}

SuccessfulScreen.navigationOptions = {
    title: 'Success'
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
 

  
      elevation: 24,
    },
  });

export default SuccessfulScreen