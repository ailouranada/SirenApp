import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, PermissionsAndroid, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
import Geolocation from '@react-native-community/geolocation';

import MapContent from "../components/MapContent";

const InteractiveMap = ({navigation}) => {

  const LATITUDE_DELTA = 0.0922; // Example latitude delta
  const LONGITUDE_DELTA = LATITUDE_DELTA * (Dimensions.get('window').width / Dimensions.get('window').height);

	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	let text = "Waiting..";

	useEffect(() => {
		(async() => {
      if(Platform.OS === "android") {
        await requestLocationPermission()
      }
  
      getGeolocation();
    })()
			
	}, []);

  async function getGeolocation() {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setLocation(position)
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        getGeolocation()
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Required",
          message: "This app needs to access your location.",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}

	return (
		<View style={styles.container}>
			{location ? (
				<>
					<MapView
						style={StyleSheet.absoluteFillObject}
						initialRegion={{
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
						}}
            region={{
              latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
            }}
					>
						<Marker
							coordinate={{
								latitude: location.coords.latitude,
								longitude: location.coords.longitude,
							}}
							title="You are here"
						/>
					</MapView>
          <MapContent navigation={navigation} />
				</>
			) : (
				<View style={styles.loadingContainer}>
					<Text>{text}</Text>
				</View>
			)}
		</View>
	);
};

export default InteractiveMap;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	map: {
		// ...StyleSheet.absoluteFillObject,
    flex: 1
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

});
