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

} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { useToast } from 'react-native-toast-notifications';
import { Icon } from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NetworkStatus } from '@apollo/client';
import { Button as Button2, VStack, CheckIcon, HStack, Button ,  FormControl,TextArea,
    Input} from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Rating } from 'react-native-ratings';
import { Linking } from 'react-native';

const COMPLETE_SR = gql`
  mutation CompleteServiceRequestMutation(
    $completeServiceRequestId: ID
    $completeServiceRequestFinalAmount: String
  ) {
    completeServiceRequest(
      id: $completeServiceRequestId
      finalAmount: $completeServiceRequestFinalAmount
    ) {
      requester_id
      provider_id
      id
      task
      state
    }
  }
`;

const CompleteScreen = ({ navigation, route }) => {
    const id = navigation.getParam('id');
    const toast = useToast();
    const [formData, setData] = React.useState({});
    const [values, setValues] = React.useState();
    const [estimate,setEstimate]=React.useState();
    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
      };
      const [refreshing, setRefreshing] = React.useState(false);

      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
       
        wait(2000).then(() => setRefreshing(false));
      }, []);

      const [completeServiceRequest, { loading_complete, error_complete }] =
      useMutation(COMPLETE_SR, {
        onCompleted: (data) => {
          toast.show('Successfully completed the request', {
            type: 'success',
            animationType: 'slide-in',
          });
          navigation.navigate('Request', { id: id });
        },
        onError: (error) => {
          console.log(error);
          toast.show('Failed ', { type: 'danger', animationType: 'slide-in' });
        },
      });

      

      if (loading_complete)
      return <Text>Loading..</Text>;

      
        const completeRequest = (event) => {
            setValues({});
            completeServiceRequest({
              variables: {
                completeServiceRequestId: id,
                completeServiceRequestFinalAmount:estimate
              },
            });
           
          };
     
     

      return(
        <ScrollView style={{ backgroundColor: 'white', width:'98%',borderWidth:1, borderColor:'#0369a1' }}>
  
        <Text
          style={{
            color: '#525252',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 14,
            marginLeft:12
          }}
        >
          Mark the Request Completed
        </Text>
        <VStack width="90%" mx="3">
        <FormControl isRequired >
  <FormControl.Label _text={{ bold: true }} style={{marginTop:10}}>
    Enter final amount charged from customer
  </FormControl.Label>
  <TextArea
    placeholder="Enter amount Eg: 7000"
    name={'completeServiceRequestFinalAmount'}
    onChangeText={(value) => {
      setData({ ...formData, max: value });
      setEstimate(value);
    }}
  />
  </FormControl>
           
         

          
          <Button2 onPress={completeRequest} mt="5" colorScheme="cyan">
            Complete Request
          </Button2>
        </VStack>
        </ScrollView>
      );
    };

CompleteScreen.navigationOptions = {
    title: 'Complete',
  };
  export default CompleteScreen;
