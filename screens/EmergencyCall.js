import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

// components
import StyledContainer from '../components/StyledContainer';
import Header from '../components/Header';
import ButtonContainer from '../components/ButtonContainer';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {auth, db} from '../firebase';
import {doc, setDoc, onSnapshot} from 'firebase/firestore';
import {get, onValue, push, ref, set, update} from 'firebase/database';
import Geolocation from '@react-native-community/geolocation';

const peerConnectionConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    // You can add more STUN/TURN servers here
  ],
};

const EmergencyCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
	const [location, setLocation] = useState()
  const [peerConnection, setPeerConnection] = useState(
    new RTCPeerConnection(peerConnectionConfig),
  );

  const callIdRef = useRef("")
  const [callId, setCallId] = useState('');
  const [userId, setUserId] = useState("9qF4YTcrufWzl8GHb3y6w02nR7D3");

  useEffect(() => {
    async function requestLocationPermission() {
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
          initStream();
        } else {
          console.log('Camera, location and audio permissions denied.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    requestLocationPermission();
    const initStream = async () => {
			await getGeolocation()
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {facingMode: 'user'},
      });
      setLocalStream(stream);
      console.log(stream);
      stream
        .getTracks()
        .forEach(track => peerConnection.addTrack(track, stream));
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // Push ICE candidate to Firebase Realtime Database
        console.log(callIdRef.current)
        if (callIdRef.current || callId) {
          // const iceCandidateRef = ref(db, `calls/${callId}/iceCandidates`);
          // set(ref(iceCandidateRef, Date.now()), event.candidate.toJSON()); // Use Date.now() for a unique key

          const iceCandidateRef = ref(db, `calls/${callIdRef.current}/iceCandidates`);
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
      // answerCall()
    };

    return () => {
      peerConnection.close();
    };
  }, [peerConnection]);

	async function getGeolocation() {
		Geolocation.getCurrentPosition(
			position => {
				console.log(position);
				setLocation(position);
				createCall(position.coords, "9qF4YTcrufWzl8GHb3y6w02nR7D3");
			},
			error => {
				// See error code charts below.
				console.log(error.code, error.message);
				getGeolocation();
			},
			{enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
		);
	}

  const createCall = async (position, userToCallId) => {
    const userRef = ref(db, `users/${userToCallId}`); // Reference to the user
    const callRef = ref(db, 'calls'); // Reference to the calls node

    // Check if the user is already in a call
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists() && userSnapshot.val().isInCall) {
      console.log(`User ${userToCallId} is already in a call.`);
      return; // Prevent call creation if user is in another call
    }

    // Update user's call status to true
    await update(userRef, {isInCall: true});

    // Create a new call entry with a unique ID
    const newCallRef = push(callRef); // Generate a unique ID for the call
    const uniqueCallId = newCallRef.key; // Get the unique ID
    setCallId(uniqueCallId); // Optionally set the callId in state
    console.log(uniqueCallId)
    callIdRef.current = uniqueCallId

    // Create an offer and set it in the Realtime Database
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const callData = {
			isAnswered: false,
      offer: offer,
      userId: userToCallId, // Store the user ID of the person to call
			location: {latitude: position.latitude, longitude: position.longitude},
      timestamp: new Date().toISOString(), // Optional: Add a timestamp
    };

    // Set the call data with the unique ID
    await set(newCallRef, callData);

    // Listen for changes to the call in the database
    onValue(newCallRef, snapshot => {
      const data = snapshot.val();
      if (data && data.answer) {
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      }
      if (data && data.iceCandidate) {
        const callData = data.iceCandidate.val();
        console.log(callData)
        if (callData) {
          callData.forEach((childSnapshot) => {
            const candidate = new RTCIceCandidate(childSnapshot.val());
            peerConnection.addIceCandidate(candidate).catch(error => {
              console.error('Error adding received ICE candidate', error);
            });
          });
        }
      }
    });

    // Update the user's status back to false when the call ends
    // This should be implemented in your call hang-up logic.
  };

  const answerCall = async () => {
    const userRef = ref(db, `users/${userId}`); // Reference to the user answering the call
    const callRef = ref(db, `calls/${callIdRef.current}`); // Reference to the specific call
    console.log(userRef, callRef)

    const callSnapshot = await get(callRef);
    // Check if the user is already in a call
    const userSnapshot = await get(userRef);
    // if (userSnapshot.exists() && userSnapshot.val().isInCall) {
    //   console.log(`User ${userId} is already in a call.`);
    //   return; // Prevent answering the call if user is in another call
    // }

    // Update user's call status to true
    await update(userRef, {isInCall: true});
    await update(callRef, {isAnswered: true});

    // Get the call data
    if (callSnapshot.exists()) {
      const data = callSnapshot.val();

      // Set the remote description from the offer
      if (data.offer) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        // const answer = await peerConnection.createAnswer();
        // await peerConnection.setLocalDescription(answer);

        // Update the call entry with the answer
        // await update(callRef, {
        //   answer: answer,
        //   iceCandidate: null, // You can also manage ICE candidates here
        // });
      }

      // Listen for ICE candidates
      onValue(callRef, snapshot => {
        const callData = snapshot.val();
        if (callData && callData.iceCandidate) {
          peerConnection.addIceCandidate(
            new RTCIceCandidate(callData.iceCandidate),
          );
        }
      });
    }
  };

  // Call hang-up function
  const endCall = async () => {
    const userRef = ref(db, `users/${userId}`); // Reference to the user
    await set(userRef, {isInCall: false}); // Update user's call status to false
    // Additional logic to handle ending the call (e.g., close peer connection)
  };

  return (
    <View bg="#93E1F0">
      {/* <Header /> */}
      <View style={{position: 'relative'}}>
        {localStream && (
          <View style={{position: "relative", width: "100%", height: "100%"}}>
          {remoteStream && <RTCView streamURL={remoteStream ? remoteStream.toURL() : ''} style={{height: "50%", width: "50%"}} />}
          <Text>{remoteStream?.toURL()}</Text>
          <RTCView
          streamURL={localStream ? localStream.toURL() : ''}
          style={{width: '100%', height: '100%'}}
          mirror
        />
        </View>
        )}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 5,
            width: '100%',
            height: '100%',
          }}>
          <View style={styles.emergencyIndicator}>
            <Image
              source={require('../assets/panic_button_small.png')}
              style={styles.panicButtonImg}
            />
            <Text style={styles.emegrncyText}>Emergency Calling...</Text>
          </View>
          <View style={styles.emergencyButtons}>
            <Text style={styles.infoText}>
              Your contact persons nearby, ambulance/police contacts will see
              your request for help.
            </Text>
            {/* <ButtonContainer /> */}
            <View style={styles.footer}>
              <Pressable>
                <Image
                  source={require('../assets/microphone.png')}
                  style={styles.footerIcon}
                />
              </Pressable>
              <Pressable>
                <Image
                  source={require('../assets/end-call.png')}
                  style={styles.footerIcon}
                />
              </Pressable>
              <Pressable>
                <Image
                  source={require('../assets/camera.png')}
                  style={styles.footerIcon}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmergencyCall;

const styles = StyleSheet.create({
  emergencyIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicButtonImg: {
    resizeMode: 'stretch',
    width: 200,
    height: 200,
    borderWidth: 10,
  },
  emegrncyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  emergencyButtons: {
    flex: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  infoText: {
    width: '85%',
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  footerIcon: {
    resizeMode: 'stretch',
    width: 40,
    height: 40,
  },
});
