import React, { useState } from 'react';
import { Icon } from 'react-native-elements';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Select, VStack, CheckIcon, HStack, Checkbox } from 'native-base';
import { Rating, AirbnbRating } from 'react-native-ratings';
//import { AppLoading } from 'expo';
//import { useFonts, Inter_200ExtraLight } from '@expo-google-fonts/inter';
const GET_PROVIDERS_BY_PROFESSION_IN_PROVINCE = gql`
  query Query(
    $searchServiceProviderbyProfessioninProvinceProfession: String!
    $searchServiceProviderbyProfessioninProvinceProvince: String
    $searchServiceProviderbyProfessioninProvinceCity: String
    $searchServiceProviderbyProfessioninProvinceRating: String
  ) {
    searchServiceProviderbyProfessioninProvince(
      profession: $searchServiceProviderbyProfessioninProvinceProfession
      province: $searchServiceProviderbyProfessioninProvinceProvince
      city: $searchServiceProviderbyProfessioninProvinceCity
      rating: $searchServiceProviderbyProfessioninProvinceRating
    ) {
      id
      username
      fullname
      profession
      province
      postalCode
      city
      bio
      roles
      service_providing_status
      provider_rating
      provider_review_count
    }
  }
`;

const GET_ME = gql`
  query Query {
    me {
      id
      username
      fullname
      email
      nic
      profession
      contactNum
      address
      province
      city
      town
      bio
      service_providing_status
      roles
      postalCode
    }
  }
`;

const ProvidersByProfessionScreen = ({ navigation, route }) => {
  //const userQuery = useQuery(GET_USERS)

  const profession = navigation.getParam('profession');
  const [checked, setChecked] = useState(false);
  const [citychecked, setCityChecked] = useState(false);
  const [values, setValues] = useState({ profession: '' });
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [rating, setRating] = useState('');
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_PROVIDERS_BY_PROFESSION_IN_PROVINCE,
    {
      variables: {
        searchServiceProviderbyProfessioninProvinceProfession: `${profession}`,
        searchServiceProviderbyProfessioninProvinceProvince: province,
        searchServiceProviderbyProfessioninProvinceCity: city,
        searchServiceProviderbyProfessioninProvinceRating: rating,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const meQuery = useQuery(GET_ME);
  if (networkStatus === NetworkStatus.refetch) return 'Refetching...';
  if (loading || meQuery.loading) return <Text>Loading</Text>;

  const providersResult = data.searchServiceProviderbyProfessioninProvince;
  //console.log(meQuery);

  const handleChange = (itemValue) => {
    console.log(itemValue);
    setRating(itemValue);
    setValues({
      ...values,
      searchServiceProviderbyProfessioninProvinceRating: itemValue,
    });
  };

  const handleCheck = (event) => {
    setChecked(!checked);
    console.log(checked, 'province', meQuery.data.me.province);
    if (!checked) {
      setProvince(meQuery.data.me.province);
      setValues({
        ...values,
        searchServiceProviderbyProfessioninProvinceProvince:
          meQuery.data.me.province,
      });
    } else {
      setProvince('');
      setValues({
        ...values,
        searchServiceProviderbyProfessioninProvinceProvince: '',
      });
    }

    refetch();
  };

  const handleCityCheck = (event) => {
    setCityChecked(!citychecked);
    console.log(citychecked, 'city');
    if (!citychecked) {
      setCity(meQuery.data.me.city);
      console.log(city);
      setValues({
        ...values,
        searchServiceProviderbyProfessioninProvinceCity: meQuery.data.me.city,
      });
    } else {
      console.log(citychecked, 'ciy');
      setCity('');
      setValues({
        ...values,
        searchServiceProviderbyProfessioninProvinceCity: '',
      });
    }
    refetch();
  };

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

          <Text style={{ margin: 6, fontSize: 16, color: '#525252' }}>
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
            <Text style={{ margin: 6, fontSize: 16, color: '#525252' }}>
              {item.provider_review_count} Reviews
            </Text>
          </View>

          <Text style={{ margin: 6, fontSize: 16, color: '#525252' }}>
            {item.bio}
          </Text>
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
              borderColor: '#525252',
              borderRadius: 8,
              borderWidth: 0.5,
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
              borderColor: '#525252',
              borderWidth: 0.5,
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
    <View style={{ backgroundColor: 'white' }}>
      <HStack>
        <Icon
          name="hammer-screwdriver"
          type="material-community"
          color="#517fa4"
          style={{
            color: '#525252',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
            marginRight:8
          }}
        />
        <Text
          style={{
            color: '#525252',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
          }}
        >
          Showing {profession}s
        </Text>
      </HStack>
      <Select
        selectedValue={rating}
        minWidth="190"
        minHeight="50"
        accessibilityLabel="Sort"
        placeholder="Sort by Rating"
        padding={4}
        _selectedItem={{
          bg: '#bae6fd',
          endIcon: <CheckIcon size="5" />,
        }}
        mt={4}
        onValueChange={(itemValue) => handleChange(itemValue)}
      >
        <Select.Item label="Highest to Lowest" value="0" />
        <Select.Item label="Lowest to Highest" value="1" />
      </Select>
      <HStack space={6}>
        <Checkbox
          accessibilityLabel="province checkbox"
          onChange={handleCheck}
          isChecked={checked}
          name={'searchServiceProviderbyProfessioninProvinceProvince'}
          marginLeft={4}
        />
        <Text style={{ color: '#525252', fontSize: 16 }}>
          Show providers only in my Province
        </Text>
      </HStack>
      <HStack space={6}>
        <Checkbox
          accessibilityLabel="city checkbox"
          onChange={handleCityCheck}
          isChecked={citychecked}
          name={'searchServiceProviderbyProfessioninProvinceCity'}
          marginLeft={4}
          marginTop={1}
          marginBottom={1}
        />
        <Text style={{ color: '#525252', fontSize: 16, marginTop: 8 }}>
          Show providers only in my City
        </Text>
      </HStack>

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
