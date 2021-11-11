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
import { Rating } from 'react-native-ratings';
import {
  Button as Button2,
  VStack,
  CheckIcon,
  HStack,
  Button,
  FormControl,
  TextArea,
  Input,
} from 'native-base';
import Constants from 'expo-constants';
import { useMutation, useQuery, gql } from '@apollo/client';

import { Linking } from 'react-native';

const FEEDBACK_SR = gql`
  mutation FeedbackServiceRequestMutation(
    $feedbackServiceRequestId: ID
    $feedbackServiceRequestRequestRating: Int
    $feedbackServiceRequestRequestReview: String
  ) {
    feedbackServiceRequest(
      id: $feedbackServiceRequestId
      requestRating: $feedbackServiceRequestRequestRating
      requestReview: $feedbackServiceRequestRequestReview
    ) {
      state
      requestRating
      requestReview
    }
  }
`;
const RequesterReviewScreen = ({ navigation, route }) => {
  const toast = useToast();

  const [formData, setData] = React.useState({});
  const id = navigation.getParam('id');
  const [values, setValues] = React.useState();
  const [review, setReview] = React.useState();
  const [rating, setRating] = React.useState();

  const [feedbackServiceRequest, { loading_Cfeedback, error_Cfeedback }] =
    useMutation(FEEDBACK_SR, {
      onCompleted: (data) => {
        toast.show('Successfully reviewed the provider', {
          type: 'success',
          animationType: 'slide-in',
        });
        navigation.navigate('Request', { id: id });
      },
      onError: (error) => {
        console.log(error);
        toast.show('Failed ', { type: 'success', animationType: 'slide-in' });
      },
    });

  if (loading_Cfeedback) return <Text>Loading</Text>;

  const ratingChanged = (newRating) => {
    setRating(newRating);
    console.log(newRating);
  };
  const onSubmit = (event) => {
    setValues({});
    feedbackServiceRequest({
      variables: {
        feedbackServiceRequestId: id,
        feedbackServiceRequestRequestRating: rating,
        feedbackServiceRequestRequestReview: review,
      },
    });
  };

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        width: '98%',
        borderWidth: 1,
        borderColor: '#0369a1',
      }}
    >
      <Text
        style={{
          color: '#525252',
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 14,
          marginLeft: 12,
        }}
      >
        Review the service provided!
      </Text>
      <VStack width="90%" mx="3">
        
        <FormControl isRequired>
          <FormControl.Label _text={{ bold: true }} style={{ marginTop: 10 }}>
            How was your experience?
          </FormControl.Label>
          <Rating
                    type="heart"
                    ratingCount={5}
                    imageSize={40}
                    showRating
                    startingValue={0}
                    onFinishRating={ratingChanged}
                    ratingBackgroundColor="#c8c7c8"
                  />
          <TextArea
            name={'feedbackServiceRequestRequestReview'}
            onChangeText={(value) => {
              setData({ ...formData, max: value });
              console.log(value);
              setReview(value);
            }}
          />
        </FormControl>

        <Button2 onPress={onSubmit} mt="5" colorScheme="cyan">
          Submit Review
        </Button2>
      </VStack>
    </ScrollView>
  );
};

RequesterReviewScreen.navigationOptions = {
  title: 'RequesterReview',
};
export default RequesterReviewScreen;
