import React from 'react';

import { useQuery, gql } from '@apollo/client';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

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
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ fontWeight: 'bold' , fontSize:18}}>
            {item.fullname} 
          </Text>
          <Text style={{ fontWeight: 'bold' , fontSize:16}}>
           ({item.username})
          </Text>

          <Text>
            {item.city} - {item.postalCode}
          </Text>
          <Text>{item.bio}</Text>
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
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'royalblue',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>navigation.navigate('HireNow', {id:item.id})}
          >
            <Text style={{ color: 'white' }}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            key={item.id}
            style={{
              height: 40,
              width: 90,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'mediumseagreen',
              borderRadius: 8,
              margin: 4,
            }}
            onPress={()=>{navigation.navigate('HireNow', {id:item.id}); console.log(item.id)}}
          >
            <Text style={{ color: 'white' }}>Hire Now</Text>
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

export default ProvidersByProfessionScreen;
