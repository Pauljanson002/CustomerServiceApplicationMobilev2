import React from 'react';
import { Icon } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
//import { AppLoading } from 'expo';
//import { useFonts, Inter_200ExtraLight } from '@expo-google-fonts/inter';
const GET_SERVICE_PROVIDER_BY_PROFESSION = gql`
  query SearchServiceProviderByProfession(
    $searchServiceProviderbyProfessionProfession: String!
  ) {
    searchServiceProviderbyProfession(
      profession: $searchServiceProviderbyProfessionProfession
    ) {
      id
      username
      fullname
      profession
      city
      bio
      service_providing_status
      roles
      postalCode
      provider_rating
      provider_review_count
    }
  }
`;
const ProvidersByProfessionScreen = ({ navigation, route }) => {
  //const userQuery = useQuery(GET_USERS)

  const profession = navigation.getParam('profession');
  const providersQuery = useQuery(GET_SERVICE_PROVIDER_BY_PROFESSION, {
    variables: {
      searchServiceProviderbyProfessionProfession: profession,
    },
  });

  if (providersQuery.loading) return <Text>Loading</Text>;

  const providersResult = providersQuery.data.searchServiceProviderbyProfession;
  console.log(profession);

  function Item({ item }) {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'felx-start', flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {item.fullname}
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            @{item.username}
          </Text>

          <Text style={{ margin: 6, fontSize: 16, color:'#525252' }}>
            <Icon
              name="google-maps"
              type="material-community"
              color="#517fa4"
            />
            {item.city} - {item.postalCode}
          </Text>
          <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <Rating
            type="star"
            ratingCount={5}
            imageSize={20}
            isDisabled={true}
            readonly={true}
            startingValue={item.provider_rating}
           
          /> 
          <Text style={{ margin: 6, fontSize: 16 , color:'#525252' }}>{item.provider_review_count} Reviews</Text>
          </View>

          <Text style={{ margin: 6, fontSize: 16, color:'#525252'  }}>{item.bio}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <TouchableOpacity
            style={{
              height: 40,
              width: 157,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor:'#525252',
              borderRadius: 8,
              borderWidth:0.5,
              margin: 4,
              
            }}
            onPress={() => navigation.navigate('HireNow', { id: item.id })}
          >
            <Text style={{ color: '#525252' }}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={item.id}
            style={{
              height: 40,
              width: 157,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor:'#525252',
              borderWidth:0.5,
              borderRadius: 8,
              margin: 4,
            }}
            onPress={() => {
              navigation.navigate('HireNow', { id: item.id });
              console.log(item.id);
            }}
          >
            <Text style={{ color: '#525252' }}>Hire Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text>
        Showing {providersResult.length} Results for {profession}
      </Text>

      <FlatList
        data={providersResult}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

ProvidersByProfessionScreen.navigationOptions = {
  title: 'ProvidersByProfession',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#a3a3a3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 0,

    elevation: 20,
  },
});

export default ProvidersByProfessionScreen;
