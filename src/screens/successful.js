import React from "react";
import {Text, View,StyleSheet} from "react-native";
import {useQuery,gql} from "@apollo/client";
import { AntDesign } from '@expo/vector-icons';

const SuccessfulScreen = ()=>{
    
    
   return(
    <View style={styles.container}>
           <AntDesign name="checkcircle" size={35} color="green" />
           <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
        Succesful!
      </Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' ,color: 'lightblue'}}>
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
      padding: 15,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
  
      elevation: 24,
    },
  });

export default SuccessfulScreen