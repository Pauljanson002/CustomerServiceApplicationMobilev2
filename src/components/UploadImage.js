import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UploadImage = () => {
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dpb0ths5c/upload';
  const [image, setImage] = useState(null);
  const [values,setValues]=useState(null);
  const [photo, setPhoto] = useState(null);
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
        })
        .catch((err) => console.log(err));
        setValues(photo);

        this.props.onChangeValues({type:'image',value:photo});

    }
  };

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
          })
          .catch((err) => console.log(err));
  
      }
  };

  return (
      <>
    <View style={imageUploaderStyles.container}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
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

    </>
    
  );
};

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
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

export default UploadImage;
