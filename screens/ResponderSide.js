import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MI from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

// components
import StyledContainer from '../components/StyledContainer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Geolocation from '@react-native-community/geolocation';
import {db} from '../firebase';
import {getDatabase, ref, onValue, get, set, update, push} from 'firebase/database';
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';
import PoliceHeader from '../components/PoliceHeader';

const peerConnectionConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    // You can add more STUN/TURN servers here
  ],
};

const ResponderSide = ({navigation}) => {
  const [currentLocation, setCurrentLocation] = useState();
  const [peerConnection, setPeerConnection] = useState(
    new RTCPeerConnection(peerConnectionConfig),
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [userId, setUserId] = useState('');
  const [callId, setCallId] = useState('');
  let callIdRef = useRef("")
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const listenForClosestUnansweredCall = currentLocation => {
    const callsRef = ref(db, 'calls');
    console.log(callsRef)

    onValue(callsRef, snapshot => {
      console.log("HEY")
      const calls = snapshot.val();
      if (calls) {
        const unansweredCalls = Object.entries(calls)
          .filter(([callId, callData]) => !callData.isAnswered)
          .map(([callId, callData]) => ({
            callId,
            ...callData,
          }));

        if (unansweredCalls.length > 0) {
          let closestCall = null;
          let shortestDistance = Infinity;

          unansweredCalls.forEach(call => {
            const distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              call.location.latitude,
              call.location.longitude,
            );

            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestCall = call;
            }
          });

          if (closestCall) {
            console.log(
              `Closest unanswered call is from ${closestCall.userId}, Call ID: ${closestCall.callId}`,
            );
            setCallId(closestCall.callId);
            setUserId(closestCall.userId);
            callIdRef.current = closestCall.callId
            // You can handle or notify the closest unanswered call here
          }
        }
      }
    });
  };

  useEffect(() => {
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // Push ICE candidate to Firebase Realtime Database
        if (callId) {
          const iceCandidateRef = ref(db, `calls/${callId}/iceCandidate`);
          console.log("HEY", event.candidate.toJSON())
          
          // Use push to generate a unique key and set the candidate data
          const newCandidateRef = push(iceCandidateRef); // Automatically generates a unique key
          set(newCandidateRef, event.candidate.toJSON())
            .then(() => {
              console.log('ICE candidate added to Firebase successfully');
            })
            .catch(error => {
              console.error('Error adding ICE candidate to Firebase:', error);
            });
        }
      }
    };

    peerConnection.ontrack = event => {
      console.log('Track received:', event.streams[0]);
      setRemoteStream(event.streams[0]);
      let stream = event.streams[0]
      console.log(event.streams)
      
    };

    return () => {
      peerConnection.close();
    };
  }, [peerConnection]);

  async function init() {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {facingMode: 'user'},
    });
    setLocalStream(stream);
    console.log(stream);
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    answerCall(callId, userId);
  }

  // Function to get the user's current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        handleFindClosestCall({latitude, longitude});
        console.log('Current location:', latitude, longitude);
      },
      error => {
        console.error('Error getting location:', error);
        getCurrentLocation();
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    // Request permission for location access on Android
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          if (
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Camera, location and audio permissions granted.');
            getCurrentLocation();
          } else {
            console.log('Camera, location and audio permissions denied.');
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        getCurrentLocation(); // iOS permissions are handled in Info.plist
      }
    };

    requestLocationPermission();
  }, []);

  const handleFindClosestCall = currentLocation => {
    if (currentLocation) {
      listenForClosestUnansweredCall(currentLocation);
    } else {
      console.log('Location not available yet.');
    }
  };

  const answerCall = async (callId, userId) => {
    const userRef = ref(db, `users/${userId}`); // Reference to the user answering the call
    
    const callRef = ref(db, `calls/${callId}`); // Reference to the specific call
    const iceCandidateRef = ref(db, `calls/${callId}/iceCandidates`); // Reference to the specific call
    console.log(userRef);
    console.log(userRef);

    // Check if the user is already in a call
    // const userSnapshot = await get(userRef);
    const callSnapshot = await get(callRef)
    if (callSnapshot.exists() && callSnapshot.val().isAnswered) {
      console.log(`User ${userId} call has been answered`);
      return; // Prevent answering the call if user is in another call
    }

    // Update user's call status to true
    await update(userRef, {isInCall: true});
    // await update(callRef, {isAnswered: true});

    // Get the call data
    if (callSnapshot.exists()) {
      const data = callSnapshot.val();

      // Set the remote description from the offer
      if (data.offer) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Update the call entry with the answer
        await update(callRef, {
          answer: answer,
          iceCandidate: null, // You can also manage ICE candidates here
        });
      }

      // Listen for ICE candidates
      onValue(iceCandidateRef, snapshot => {
        const callData = snapshot.val();
        console.log(callData)
        if (callData) {
          Object.keys(callData).forEach((childSnapshot) => {
            console.log(callData[childSnapshot])
            const candidate = new RTCIceCandidate(callData[childSnapshot]);
            peerConnection.addIceCandidate(candidate).catch(error => {
              console.error('Error adding received ICE candidate', error);
            });
          });
        }
      });
    }
  };

  async function answerEmergency() {
    init();
  }

  return (
    <StyledContainer>
      <Header responder={true} />
      {localStream ? (
        <View style={{position: "relative", flex: 1}}>
          <RTCView streamURL={remoteStream ? remoteStream.toURL() : ''} style={{flex: 1}} mirror />
          <RTCView
          streamURL={localStream ? localStream.toURL() : ''}
          style={{position: "absolute", bottom: 5, right: 10, zIndex: 10, aspectRatio: 9/16, width: "30%"}}
          mirror
        />
        </View>
      ) : !callId && !userId ? (
        <View style={styles.container}>
          <Image
            source={require('../assets/police-logo.png')}
            style={styles.bg}
          />

          <View style={styles.blocker} />
          <View style={styles.buttons}>
            <Pressable style={styles.button}>
              <MI name="phone" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>Emergency Call</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('ResponderAlert')}>
              <MCI name="monitor-eye" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>View Alerts</Text>
            </Pressable>
            <Pressable style={styles.button}>
              <MCI name="message-text" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>Emergency Text</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.blocker}>
            <Text style={styles.sos}>EMERGENCY</Text>
            <Text style={styles.sos2}>Someone needs help!</Text>
            <Pressable onPress={() => answerEmergency()}>
              <FastImage
                style={{width: '100%', height: '100%'}}
                source={require('../assets/answer_button.gif')} // Adjust the path as necessary
                resizeMode={FastImage.resizeMode.contain} // or cover, depending on your needs
              />
            </Pressable>
          </View>

          <View style={styles.buttons}>
            <Pressable style={styles.button}>
              <MI name="phone" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>Emergency Call</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('ResponderAlert')}>
              <MCI name="monitor-eye" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>View Alerts</Text>
            </Pressable>
            <Pressable style={styles.button}>
              <MCI name="message-text" size={60} color={'#D7F1F7'} />
              <Text style={styles.text}>Emergency Text</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* <Footer navigation={navigation} /> */}
    </StyledContainer>
  );
};

export default ResponderSide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    resizeMode: 'contain',
    width: '100%',
    top: -30,
  },
  blocker: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#08B6D9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D7F1F7',
    textAlign: 'center',
  },
  sos: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  sos2: {
    fontSize: 24,
    fontWeight: '500',
    color: 'red',
    textAlign: 'center',
  },
});
