import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker

const MapReport = ({location, handleLocation}) => {
  return (
		<View style={styles.map}>
			<MapView
				style={styles.mapView}
				initialRegion={{
					latitude: location.latitude, // Set default latitude
					longitude: location.longitude, // Set default longitude
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				region={{
					latitude: location.latitude, // Set default latitude
					longitude: location.longitude, // Set default longitude
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				
			>
				<Marker draggable onDragEnd={(e) => handleLocation(e.nativeEvent.coordinate)} coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
			</MapView>
		</View>
	);
}

export default MapReport

const styles = StyleSheet.create({
	map: {
		height: 200,
		width: "90%",
		marginHorizontal: "auto",
		padding: 5,
		backgroundColor: "#08B6D9",
		marginTop: 10,
		borderRadius: 10,
    zIndex: -1
	},
	mapView: {
		flex: 1,
	},
});