import React, { useState } from 'react';
import { Text, View, TextInput, Platform, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  VStack,
  Button as Button2,
  FormControl,
  Input,
  TextArea,
  NativeBaseProvider,
  Center,
  CheckIcon,
  Select,
} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '../components/Loading';

const GET_ME = gql`
  query Query {
    me {
        id
        username
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
    }
  }
`;

const CREATE_NEW_SR = gql`
  mutation CreateSR(
    $createServiceRequestTask: String!
    $createServiceRequestDate: String!
    $createServiceRequestTime: String!
    $createServiceRequestProviderId: ID
    $createServiceRequestPayMethod: String
    $createServiceRequestMinPrice: String
    $createServiceRequestMaxPrice: String
    $createServiceRequestLocation: String
    $createServiceRequestImage1: String
    $createServiceRequestImage2: String
    $createServiceRequestImage3: String
  ) {
    createServiceRequest(
      task: $createServiceRequestTask
      date: $createServiceRequestDate
      time: $createServiceRequestTime
      provider_id: $createServiceRequestProviderId
      payMethod: $createServiceRequestPayMethod
      min_price: $createServiceRequestMinPrice
      max_price: $createServiceRequestMaxPrice
      location: $createServiceRequestLocation
      image1: $createServiceRequestImage1
      image2: $createServiceRequestImage2
      image3: $createServiceRequestImage3
    ) {
      task
      max_price
      location
    }
  }
`;

function BuildingAForm({id}) {
  const [formData, setData] = useState({});
  const [values, setValues] = useState({
    createServiceRequestProviderId: id
  });
  const [errors, setErrors] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [task, setTask] = useState();
  let [payment, setPayment] = React.useState('');

  const { loading, error, data } = useQuery(GET_ME);
  const [
    createServiceRequest,
    { loading_mutation, error_mutation }
  ] = useMutation(CREATE_NEW_SR, {
    onCompleted: data => {
      history.push('/');
    }
  });
  if (loading_mutation|| loading) {
    return <Text>Loading..</Text>;
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn('A date has been picked: ', date);
    setDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    console.warn('A time has been picked: ', time);
    setTime(time);
    hideTimePicker();
  };

  const validate = () => {
    if (formData.name === undefined) {
      setErrors({
        ...errors,
        name: 'Name is required',
      });
      return false;
    } else if (formData.name.length < 3) {
      setErrors({
        ...errors,
        name: 'Name is too short',
      });
      return false;
    }
    return true;
  };

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = () => {
    createServiceRequest({
        variables: {
          ...values,
          createServiceRequestLocation:data.me.address,
          createServiceRequestDate:date,
          createServiceRequestTime:time,
          createServiceRequestPayMethod:payment,
          createServiceRequestTask:task,
          createServiceRequestMinPrice:min,
          createServiceRequestMaxPrice:max,

        }
      });
      console.log("done");
  };

  return (
    <ScrollView>
      <VStack width="90%" mx="3">
        <FormControl isRequired>
          <FormControl.Label _text={{ bold: true }}>
            Service Date
          </FormControl.Label>
          <Button title="Select from Date Picker" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            name={'createServiceRequestDate'}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label _text={{ bold: true }}>
            Service Time
          </FormControl.Label>
          <Button title="Select from Time Picker" onPress={showTimePicker} />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            name={'createServiceRequestTime'}
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </FormControl>

        <FormControl disabled>
          <FormControl.Label _text={{ bold: true }}>
            Service Location
          </FormControl.Label>
          <Input disabled value={data.me.address} />
        </FormControl>

        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }}>
            Price Range you expect to pay
          </FormControl.Label>
          <Input
            placeholder="Min Value"
            name={'createServiceRequestMinPrice'}
            onChangeText={(value) =>{ setData({ ...formData, min: value }); setMin(value)}}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }}>
            -
          </FormControl.Label>
          <Input
            placeholder="Max Value"
            name={'createServiceRequestMaxPrice'}
            onChangeText={(value) => {setData({ ...formData, max: value }); setMax(value)}}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }}>
            Payment Method
          </FormControl.Label>
          <VStack alignItems="center" space={4}>
            <Select
            name={'createServiceRequestPayMethod'}
              selectedValue={payment}
              minWidth="200"
              accessibilityLabel="Choose Payment Method"
              placeholder="Choose Payment Method"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) => setPayment(itemValue)}
            >
              <Select.Item label="Cash" value="1" />
              <Select.Item label="Card" value="0" />
            </Select>
          </VStack>
        </FormControl>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }}>
            Job Description
          </FormControl.Label>
          <TextArea
            placeholder="Explain what you need to get done"
            name={'createServiceRequestTask'}
            onChangeText={(value) => {setData({ ...formData, max: value }); setTask(value)}}
          />
        </FormControl>
        <Button2 onPress={onSubmit} mt="5" colorScheme="cyan">
          Submit
        </Button2>
      </VStack>
    </ScrollView>
  );
}
const HireNowScreen = ({ navigation, route }) => {
  const uid = navigation.getParam('id');
 
 
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <BuildingAForm id={uid} />
      </Center>
    </NativeBaseProvider>
  );
};

HireNowScreen.navigationOptions = {
  title: 'HireNow',
};

export default HireNowScreen;
