import React from 'react';
//import { Tile } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image,
  ImageBackground,
  
} from 'react-native';
//import { NativeBaseProvider, Text, Box } from 'native-base';
//import FastImage from "react-native-fast-image";
const GET_USERS = gql`
  query Query {
    users {
      username
      id
    }
  }
`;
const GET_ALL_SERVICE_TYPES = gql`
  query Query {
    viewAllServiceTypes {
      id
      service_name
      description
      user_type
      image
    }
  }
`;
const RequestersScreen = ({ navigation }) => {
  const service_types = useQuery(GET_ALL_SERVICE_TYPES);
  if (service_types.loading) return <Text>Loading</Text>;



  const Item = ({ title }) => (
    <View style={styles.item}>
      <Image source={title.image} />
      <Text style={styles.title}>{title.service_name}</Text>
    </View>
  );

  const renderItem = ({ item }) => <Item title={item} />;
  const image = {
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxPUEIsg0WkeTKuH4vhKE9GMIpCDrkYQEafQ&usqp=CAU',
  };
  return (
      <ScrollView>
    <View>
        <ImageBackground source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0-J0SIosTNX-obDuDjEupk3Jh-IywbLeq4g&usqp=CAU'}}
       style={{width: '100%', height: 200}}> 
      <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
        Get it Done by Quality Pros!
      </Text>
      </ImageBackground>
   

     <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' ,padding:20}}>
    Select What You Want To Get Done!
         </Text> 
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {service_types.data.viewAllServiceTypes.map((type) => (
            <TouchableOpacity
            key={type.id}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: 'lightskyblue',
                alignSelf: 'flex-start',
                marginHorizontal: '1%',
                marginBottom: 6,
                minWidth: '48%',
                textAlign: 'center',
                
              }}
              onPress={()=>navigation.navigate('ProvidersByProfession', {profession:type.user_type})}
             
            >
                <Image style={{height:'30%', width:'100%' , alignContent:'space-around'}} source={{uri:`${type.image}`}} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  
                  color: 'black',
                }}
              >
                {type.service_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

    
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 25,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
  item: {
    backgroundColor: 'lightskyblue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

RequestersScreen.navigationOptions = {
    title: 'Requesters'
};

export default RequestersScreen;
