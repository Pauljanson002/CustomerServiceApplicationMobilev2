import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Button,
} from 'react-native';
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
  HStack,
} from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import Loading from '../components/Loading';
import UploadImage from '../components/UploadImage';

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

function BuildingAForm({ id, navigation, onChangeValues }) {
  //IMAGE_UPLOAD
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dpb0ths5c/upload';
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [image2, setImage2] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  useEffect(() => {
    checkForCameraRollPermission();
    checkForCameraPermission();
  }, []);

  const checkForCameraRollPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    } else {
      console.log('Media Permissions are granted');
    }
  };
  const checkForCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== 'granted') {
      await ImagePicker.requestCameraPermissionsAsync();
    } else {
      console.log('Camera Permissions are granted');
    }
  };
//upload image from media library
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(JSON.stringify(_image));

    if (!_image.cancelled) {
      setImage(_image.uri);

      let base64Img = `data:image/jpg;base64,${_image.base64}`;

      let data = {
        file: base64Img,
        upload_preset: 'serviceRequest',
      };
      setUploading(true);
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data);
          setPhoto(data.url);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };
//upload image from camera
  const getImage = async () => {
    let _image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(JSON.stringify(_image));

    if (!_image.cancelled) {
      setImage(_image.uri);

      let base64Img = `data:image/jpg;base64,${_image.base64}`;

      let data = {
        file: base64Img,
        upload_preset: 'serviceRequest',
      };
      setUploading(true);
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data);
          setPhoto(data.url);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };
  const addImage2 = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(JSON.stringify(_image));

    if (!_image.cancelled) {
      setImage2(_image.uri);

      let base64Img = `data:image/jpg;base64,${_image.base64}`;

      let data = {
        file: base64Img,
        upload_preset: 'serviceRequest',
      };
      setUploading(true);
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data);
          setPhoto2(data.url);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };
//upload image from camera
  const getImage2 = async () => {
    let _image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    console.log(JSON.stringify(_image));

    if (!_image.cancelled) {
      setImage2(_image.uri);

      let base64Img = `data:image/jpg;base64,${_image.base64}`;

      let data = {
        file: base64Img,
        upload_preset: 'serviceRequest',
      };
      setUploading(true);
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data);
          setPhoto2(data.url);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    }
  };
//HIRE NOW FORM
  const [formData, setData] = useState({});
  const [values, setValues] = useState({
    createServiceRequestProviderId: id,
  });
  const [errors, setErrors] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [task, setTask] = useState();
  const [image1, setImage1] = useState();
  let [payment, setPayment] = React.useState('');

  onChangeValues = (values) => {
    const { type, value } = values;
    console.log(value);
    setImage1(value);
  };

  function ToastComponent() {
    React.useEffect(() => {
      Toast.show({
        type: 'success',
        text1: 'Hello',
        text2: 'This is some something 👋',
      });
    }, []);

    return <View />;
  }

  const { loading, error, data } = useQuery(GET_ME);
  const [createServiceRequest, { loading_mutation, error_mutation }] =
    useMutation(CREATE_NEW_SR, {
      onCompleted: (data) => {
        return <ToastComponent />;
      },
    });
  if (loading_mutation || loading) {
    return <Text>Loading..</Text>;
  }

  if (uploading) {
    return <Text>Uploading..</Text>;
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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = () => {
    createServiceRequest({
      variables: {
        ...values,
        createServiceRequestLocation: data.me.address,
        createServiceRequestDate:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1 < 10 ? '0' : '') +
          parseInt(date.getMonth() + 1) +
          '-' +
          (date.getDate() < 10 ? '0' : '') +
          date.getDate(),
        createServiceRequestTime:
          (time.getHours() < 10 ? '0' : '') +
          time.getHours() +
          ':' +
          (time.getMinutes() < 10 ? '0' : '') +
          time.getMinutes(),
        createServiceRequestPayMethod: payment,
        createServiceRequestTask: task,
        createServiceRequestMinPrice: min,
        createServiceRequestMaxPrice: max,
        createServiceRequestImage1: photo,
        createServiceRequestImage2: photo2,
      },
    });
    console.log('done');
    navigation.navigate('Success');
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
        }}
      >
        Create Service Request
      </Text>
      <VStack width="90%" mx="3">
        <FormControl isRequired>
          <FormControl.Label _text={{ bold: true }}>
            Service Date
          </FormControl.Label>
          <Input
            disabled
            value={
              date
                ? date.getDate() +
                  '-' +
                  (date.getMonth() + 1 < 10 ? '0' : '') +
                  parseInt(date.getMonth() + 1) +
                  '-' +
                  date.getFullYear()
                : ''
            }
          />
          <Button title={'Select a Date'} onPress={showDatePicker} />
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

          <Input
            disabled
            value={
              time !== ''
                ? (time.getHours() < 10 ? '0' : '') +
                  time.getHours() +
                  ':' +
                  (time.getMinutes() < 10 ? '0' : '') +
                  time.getMinutes()
                : ''
            }
          />

          <Button title="Select a Time" onPress={showTimePicker} />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            name={'createServiceRequestTime'}
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </FormControl>

        <FormControl disabled>
          <FormControl.Label _text={{ bold: true }} style={{ marginTop: 10 }}>
            Service Location
          </FormControl.Label>
          <Input disabled value={data.me.address} />
        </FormControl>

        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }} style={{ marginTop: 10 }}>
            Price Range you expect to pay
          </FormControl.Label>
          <Input
            placeholder="Min Value"
            name={'createServiceRequestMinPrice'}
            value={min}
            onChangeText={(value) => {
              setData({ ...formData, min: value });
              setMin(value);
            }}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }}>-</FormControl.Label>
          <Input
            placeholder="Max Value"
            name={'createServiceRequestMaxPrice'}
            value={max}
            onChangeText={(value) => {
              setData({ ...formData, max: value });
              setMax(value);
            }}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'name' in errors}>
          <FormControl.Label _text={{ bold: true }} style={{ marginTop: 10 }}>
            Payment Method
          </FormControl.Label>
          <VStack alignItems="center" space={4}>
            <Select
              name={'createServiceRequestPayMethod'}
              selectedValue={payment}
              minWidth="340"
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
          <FormControl.Label _text={{ bold: true }} style={{ marginTop: 10 }}>
            Job Description
          </FormControl.Label>
          <TextArea
            placeholder="Explain what you need to get done"
            name={'createServiceRequestTask'}
            value={task}
            onChangeText={(value) => {
              setData({ ...formData, max: value });
              setTask(value);
            }}
          />
        </FormControl>




        <HStack>
          <View style={imageUploaderStyles.container}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150 }}
              />
            )}
            <View style={imageUploaderStyles.uploadBtnContainer}>
              <TouchableOpacity
                onPress={addImage}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image ? 'Edit' : 'Upload'} Image 1</Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={getImage}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image ? 'Edit' : 'Camera'} </Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={imageUploaderStyles.container}>
            {image2 && (
              <Image
                source={{ uri: image2 }}
                style={{ width: 150, height: 150 }}
              />
            )}
            <View style={imageUploaderStyles.uploadBtnContainer}>
              <TouchableOpacity
                onPress={addImage2}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image2 ? 'Edit' : 'Upload'} Image 2</Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={getImage2}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image2 ? 'Edit' : 'Camera'} </Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </HStack>



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
        <BuildingAForm id={uid} navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 150,
    width: 150,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
    margin:8
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

HireNowScreen.navigationOptions = {
  title: 'HireNow',
};

export default HireNowScreen;
