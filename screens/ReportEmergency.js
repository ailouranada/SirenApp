import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MI from 'react-native-vector-icons/MaterialIcons';
import SLI from 'react-native-vector-icons/SimpleLineIcons';

import Container from '../components/Container';
import Footer from '../components/Footer';
import MapReport from '../components/MapReport';
import FilterButton from '../components/FilterButton';
import DateTimeInput from '../components/DateTimeInput';
import Video, {VideoRef} from 'react-native-video';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {push, ref, set} from 'firebase/database';
import {getDownloadURL, uploadBytes, ref as reference} from 'firebase/storage';
import {db, storage} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const ReportEmergency = ({navigation}) => {
  const category = [
    {
      name: 'Natural Disaster',
      img: require('../assets/flood.png'),
    },
    {
      name: 'Fires and Explotions',
      img: require('../assets/fire.png'),
    },
    {
      name: 'Road Accidents',
      img: require('../assets/road.png'),
    },
  ];

  const [showCateg, setShowCateg] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [details, setDetails] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCateg, setSelectedCateg] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [status, setStatus] = useState('Standby');

  useEffect(() => {
    getGeolocation();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', typeof date, date);
    setSelectedDate(date);
    hideDatePicker();
  };

  const takePicture = async () => {
    const result = await launchCamera({
      mediaType: 'mixed',
      saveToPhotos: true,
      durationLimit: 60,
      includeBase64: false,
      formatAsMp4: true,
    });

    console.log(result);

    if (result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets);
    }
  };

  const uploadMediaToStorage = async mediaFiles => {
    setStatus('Uploading');
    const uploadedUrls = [];

    for (const file of mediaFiles) {
      const {uri, fileName, type} = file; // Get file details
      console.log(file);
      const response = await fetch(uri); // Convert to blob
      const blob = await response.blob();
      console.log(storage);
      const storageRef = reference(storage, `reports/${fileName}`); // Firebase Storage reference
      console.log('REF', storageRef);

      try {
        const snapshot = await uploadBytes(storageRef, blob); // Upload file
        console.log('File uploaded successfully:', snapshot);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedUrls.push({file: file, url: downloadURL});
        console.log(downloadURL);
        setStatus('Uploaded');
      } catch (error) {
        setStatus('Upload error');
        console.error('Error uploading file:', error);
      }
    }

    setImageUrls(uploadedUrls); // Store uploaded file URLs
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      durationLimit: 30,
      selectionLimit: 3,
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets);
      uploadMediaToStorage(result.assets);
    }
  };

  const submit = async (
    date,
    latitude,
    longitude,
    details,
    assets,
    category,
  ) => {
    setStatus('Submitting');
    const userId = await AsyncStorage.getItem('userId');
    const reportRef = ref(db, 'reports/');
    const newReportRef = push(reportRef);

    set(newReportRef, {
      status: 'Reported',
      timestamp: new Date(date).getTime(),
      location: {latitude: latitude, longitude: longitude},
      details: details,
      assets: assets ?? [],
      category: category,
      createdAt: Date.now(),
      senderId: userId,
    })
      .then(() => {
        console.log('Data saved successfully with auto ID!');
        setStatus('Submitted');
      })
      .catch(error => {
        setStatus('Submitted error');
        console.error('Error writing document: ', error);
      });
  };

  async function getGeolocation() {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        // setLocation(position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        getGeolocation();
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }

  return (
    <Container bg="#D6F0F6">
      <View style={styles.back}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MI name="arrow-back-ios" size={40} color={'#0B0C63'} />
        </TouchableOpacity>
        <Text style={styles.backText}>Report Emergency</Text>
      </View>
      {status === 'Submitted' ? (
        <View style={{display: "flex", justifyContent: "center", alignItems: "center", flex: 1}}>
          <Text style={{color: "#08B6D9", fontSize: 20, fontWeight: "bold"}}>Successfully submitted report</Text>
        </View>
      ) : (
        <ScrollView style={styles.reportContainer}>
          <View style={styles.filterRowContainer}>
            <TouchableOpacity style={styles.filter} onPress={showDatePicker}>
              <Text>
                {selectedDate ? selectedDate.toLocaleString() : 'Date Time'}
              </Text>
              <MI name="calendar-month" size={30} color={'#0B0C63'} />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <View style={[styles.filter, styles.categ]}>
              <TouchableOpacity
                style={[
                  styles.filter,
                  {
                    width: '100%',
                  },
                ]}
                onPress={() => setShowCateg(!showCateg)}>
                <Text>{selectedCateg ? selectedCateg : 'Select Category'}</Text>
                <MI name={'arrow-downward'} size={30} color={'#0B0C63'} />
              </TouchableOpacity>
              {showCateg && (
                <View style={styles.categList}>
                  {category.map((categ, index) => (
                    <TouchableOpacity
                      style={styles.category}
                      key={index}
                      onPress={() => {
                        setSelectedCateg(categ.name);
                        setShowCateg(false);
                      }}>
                      <Image source={categ.img} />
                      <Text>{categ.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.location}>
            <Text>Location</Text>
            <MI name={'my-location'} size={30} color={'#0B0C63'} />
          </View>
          <MapReport location={location} handleLocation={setLocation} />

          <View style={styles.emergencyDetails}>
            <Text style={styles.emergencyDetailsText}>Emergency Details</Text>
            <TextInput
              placeholder="Ex. someone fell from the building, what do they need"
              style={styles.detailsInput}
              multiline={true}
              numberOfLines={7}
              value={details}
              onChangeText={setDetails}
            />
          </View>
          <View style={styles.emergencyDetails}>
            <Text style={styles.emergencyDetailsText}>Photos/Videos</Text>
            {imageUrls && imageUrls.length > 0 ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 5,
                  marginVertical: 5,
                }}>
                {imageUrls.map((media, index) => {
                  if (media.file.type.includes('video')) {
                    return (
                      <Video
                        key={index}
                        // Can be a URL or a local file.
                        source={{uri: media.url}}
                        // Store reference
                        // ref={videoRef}
                        // Callback when remote video is buffering
                        // onBuffer={onBuffer}
                        // // Callback when video cannot be loaded
                        // onError={onError}
                        // style={styles.backgroundVideo}
                        style={{width: 80, height: 80}}
                      />
                    );
                  } else {
                    return (
                      <Image
                        key={index}
                        source={{uri: media.url}}
                        style={{width: 80, height: 80}}
                      />
                    );
                  }
                })}
              </View>
            ) : (
              <View style={styles.iconUpload}>
                <TouchableOpacity onPress={pickImage}>
                  <SLI name="cloud-upload" size={40} color={'#0B0C63'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}>
                  <SLI name="camera" size={40} color={'#0B0C63'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Pressable
            style={styles.button}
            disabled={status === 'Submitting' || status === 'Uploading'}
            onPress={() =>
              submit(
                selectedDate,
                location.latitude,
                location.longitude,
                details,
                imageUrls,
                selectedCateg,
              )
            }>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </ScrollView>
      )}
      {/* <Footer navigation={navigation} /> */}
    </Container>
  );
};

export default ReportEmergency;

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 20,
  },
  backText: {
    fontSize: 20,
    color: '#0B0C63',
    fontWeight: 'bold',
  },
  reportContainer: {
    flex: 1,
    marginBottom: 10,
  },
  filterRowContainer: {
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: 'auto',
    gap: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filter: {
    flexDirection: 'row',
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#08B6D9',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
    position: 'relative',
  },
  location: {
    flexDirection: 'row',
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#08B6D9',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
    position: 'relative',
    marginHorizontal: 20,
  },

  categList: {
    position: 'absolute',
    width: '100%',
    bottom: -150,
    right: 0,
    padding: 5,
    backgroundColor: '#08B6D9',
    maxHeight: 150,
    height: 150,
    zIndex: 10,
    borderRadius: 10,
    overflow: 'scroll',
    gap: 10,
  },
  category: {
    flexDirection: 'row',
    backgroundColor: '#D6F0F6',
    paddingVertical: 10,
    gap: 10,
    paddingLeft: 5,
    borderRadius: 5,
  },
  emergencyDetails: {
    width: '90%',
    marginHorizontal: 'auto',
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#08B6D9',
  },
  emergencyDetailsText: {
    fontWeight: 'bold',
    color: '#0B0C63',
  },
  detailsInput: {
    borderWidth: 1,
    textAlignVertical: 'top',
    backgroundColor: '#D6F0F6',
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
  },
  iconUpload: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#0B0C63',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '90%',
    marginHorizontal: 'auto',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
