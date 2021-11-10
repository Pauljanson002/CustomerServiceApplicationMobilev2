import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { useToast } from 'react-native-toast-notifications';
import { Icon } from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NetworkStatus } from '@apollo/client';
import {
  Button as Button2,
  VStack,
  CheckIcon,
  HStack,
  Button,
  FormControl,
  TextArea,
  Input,
  Center,
} from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Rating } from 'react-native-ratings';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GET_USER_WITH_REVIEWS=gql`
query Query($getUserbyIdId4: ID!, $getReviewedRequestsofUserId2: ID) {
  getUserbyId(id: $getUserbyIdId4) {
          id
      username
      roles
      service_providing_status
      profession
      town
      city
      postalCode
      profile_url
      fullname
      bio
      provider_rating
      requester_rating
      contactNum
      email
      address
  }
  getReviewedRequestsofUser(id: $getReviewedRequestsofUserId2) {
    id
    date
    task
    requestRating
    requestReview
    finalAmount
    state
  }
}
`;

const ViewProfileScreen = ({navigation, route }) => {
    const toast = useToast();
    const id = navigation.getParam('id');
console.log(id);
    const { loading, error, data } = useQuery(GET_USER_WITH_REVIEWS, {
        variables: {
          getUserbyIdId4: id,
          getReviewedRequestsofUserId2: id
        }
      });
      if(loading)return <Text>Loading..</Text>;

    const profileDetails=data.getUserbyId;
    console.log(profileDetails.profile_url)
    return(
        <>
        <SafeAreaView >
              <Center>
        <Image
          source={{
            uri:
              'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png',
          }}
          //borderRadius style will help us make the Round Shape Image
          style={{ width: 100, height: 100, borderRadius: 200 / 2 , margin:6}}
        />
        <Text style={styles.textHeadingStyle}>{profileDetails.fullname}</Text>
        <Text style={styles.textHeadingStyle}>@{profileDetails.username}</Text>
        </Center>
    <ScrollView>
              <TableView
                appearance="light"
                style={{ backgroundColor: '#faf5ff' }}
              >
                <Section
                  style={{ backgroundColor: '#faf5ff' }}
                  footer="Profile page of user"
                  
                >
                    <Cell
                    cellStyle="RightDetail"
                    title="As a Provider Rating"
                    detail={profileDetails.provider_rating>0?profileDetails.provider_rating+" / 5":'N/A'}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="As a Requester Rating"
                    detail={profileDetails.requester_rating>0?profileDetails.requester_rating+" / 5":'N/A'}
                  />
                 

                  <Cell
                    cellStyle="RightDetail"
                    title="Contact Number"
                    detail={profileDetails.contactNum}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Email"
                    detail={profileDetails.email}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Province"
                    detail={profileDetails.province}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="City"
                    detail={profileDetails.city}
                  />
                  <Cell
                    cellStyle="RightDetail"
                    title="Postal Code"
                    detail={profileDetails.postalCode}
                  />
{profileDetails.bio?<>
                  <Cell cellStyle="Subtitle" title="Bio">
                    <Text
                      style={{
                        marginLeft: 10,
                        marginBottom: 10,
                        fontSize: 16,
                        color: '#525252',
                      }}
                    >
                     {profileDetails.bio}
                    </Text>
                  </Cell>
                  </>:<></>
}
 
                </Section>
              </TableView>
              </ScrollView>
              </SafeAreaView>
</>
            
        );
    
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e0dcdc',
    },
    textHeadingStyle: {
      marginTop: 10,
      fontSize: 24,
      color: '#0250a3',
      fontWeight: 'bold',
    },
  });

ViewProfileScreen.navigationOptions = {
  title: 'ViewProfile',
};
export default ViewProfileScreen;
