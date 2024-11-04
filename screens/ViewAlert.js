import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	FlatList,
} from "react-native";
import React from "react";
import MI from "react-native-vector-icons/MaterialIcons";

// component
import Container from "../components/Container";
import AlertCard from "../components/AlertCard";

const ViewAlert = ({ navigation }) => {
	const nearbyAccidents = [
		{
			id: "1",
			title: "Truck and Jeep Accident",
			dateString: "24 Feb 2024",
			timeAgo: "2m ago",
			viewsString: "560",
			address: "Brgy. Singko Lipa, Batangas",
			imageSource: require("../assets/truck_accident.jpg"),
			distanceFromUser: "10m away",
		},
		{
			id: "2",
			title: "Fire Alert",
			dateString: "24 Feb 2024",
			timeAgo: "25m ago",
			viewsString: "568",
			address: "Brgy. San Juan, Batangas",
			imageSource: require("../assets/fire_accident.jpg"),
			distanceFromUser: "55m away",
		},
		{
			id: "3",
			title: "Fire Alert",
			dateString: "24 Feb 2024",
			timeAgo: "25m ago",
			viewsString: "568",
			address: "Brgy. San Juan, Batangas",
			imageSource: require("../assets/fire_accident.jpg"),
			distanceFromUser: "55m away",
		},
		{
			id: "4",
			title: "Fire Alert",
			dateString: "24 Feb 2024",
			timeAgo: "25m ago",
			viewsString: "568",
			address: "Brgy. San Juan, Batangas",
			imageSource: require("../assets/fire_accident.jpg"),
			distanceFromUser: "55m away",
		},
		{
			id: "5",
			title: "Fire Alert",
			dateString: "24 Feb 2024",
			timeAgo: "25m ago",
			viewsString: "568",
			address: "Brgy. San Juan, Batangas",
			imageSource: require("../assets/fire_accident.jpg"),
			distanceFromUser: "55m away",
		},
	];

	return (
		<Container bg="#93E1F0">
			<View style={styles.back}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<MI name="arrow-back-ios" size={40} color={"#0B0C63"} />
				</TouchableOpacity>
				<Text style={styles.backText}>View Alerts</Text>
			</View>

			<View style={styles.container}>
				<Text style={styles.textInfo}>Happening Right Now!</Text>
				<AlertCard
					title={"Flood Alert"}
					dateString={"24 Feb 2024"}
					timeAgo={"1s ago"}
					viewsString={"1.1k"}
					address={"Brgy. Taytay Nagcarlan, Laguna "}
					imageSource={require("../assets/car_accident.jpg")}
					distanceFromUser={"43km away"}
				/>

				<View style={styles.nearbyAccidents}>
					<Text style={styles.textInfo}>Nearby Accidents</Text>
					<FlatList
						data={nearbyAccidents}
						renderItem={({ item }) => (
							<AlertCard
								title={item.title}
								dateString={item.dateString}
								timeAgo={item.timeAgo}
								viewsString={item.viewsString}
								address={item.address}
								imageSource={item.imageSource}
								distanceFromUser={item.distanceFromUser}
							/>
						)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			</View>
		</Container>
	);
};

export default ViewAlert;

const styles = StyleSheet.create({
	back: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 20,
		paddingLeft: 20,
	},
	backText: {
		fontSize: 20,
		color: "#0B0C63",
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		marginTop: 10,
		paddingHorizontal: "5%",
	},
	textInfo: {
		fontSize: 22,
		color: "#0B0C63",
		fontWeight: "bold",
		marginBottom: 10,
	},
	nearbyAccidents: {
		flex: 1,
	},
});
