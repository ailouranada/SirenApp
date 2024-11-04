import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

import MCI from "react-native-vector-icons/MaterialCommunityIcons";
import FS from "react-native-vector-icons/FontAwesome";

// component
import StyledContainer from "../components/StyledContainer.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

MCI.loadFont();

const Dashboard = ({ navigation }) => {
	return (
		<StyledContainer>
			<Header />
			<View style={styles.container}>
				<View style={styles.wrapper}>
					<TouchableOpacity style={styles.box} onPress={() => navigation.navigate("ReportEmergency")}>
						<Text style={styles.boxText}>Report Emergency</Text>
						<MCI size={50} name="alert-circle" color={"#D7F1F7"} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.box} onPress={() => navigation.navigate("ViewAlert")}>
						<Text style={styles.boxText}>View Alerts</Text>
						<MCI size={50} name="monitor-eye" color={"#D7F1F7"} />
					</TouchableOpacity>
					<View
						style={[
							styles.box,
							{
								justifyContent: "flex-end",
							},
						]}
					>
						<MCI size={50} name="phone-ring" color={"#D7F1F7"} />
						<Text style={styles.boxText}>Emergency Call</Text>
					</View>
					<View
						style={[
							styles.box,
							{
								justifyContent: "flex-end",
							},
						]}
					>
						<FS size={50} name="telegram" color={"#D7F1F7"} />
						<Text style={styles.boxText}>Emergency Text</Text>
					</View>

					<View style={styles.bigCircleContainer}>
						<TouchableOpacity
							style={styles.bigCircle}
							onPress={() => navigation.navigate("EmergencyCall")}
						>
							<Image
								source={require("../assets/panic_button.png")}
								style={styles.panicButton}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<Footer navigation={navigation} />
		</StyledContainer>
	);
};

export default Dashboard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	wrapper: {
		width: "90%",
		height: "80%",
		position: "relative",
		flexWrap: "wrap",
		flexDirection: "row",
		gap: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	box: {
		width: "49%",
		height: "50%",
		borderRadius: 50,
		backgroundColor: "#087BB8",
		paddingVertical: 20,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	boxText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 20,
		width: "100%",
		textAlign: "center",
	},

	bigCircleContainer: {
		width: "65%",
		aspectRatio: 1,
		position: "absolute",
	},
	bigCircle: {
		flex: 1,
		borderRadius: 1000,
		backgroundColor: "#45D2F6",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	panicButton: {
		resizeMode: "strecth",
		height: "95%",
		width: "90%",
		marginHorizontal: "auto",
	},
});
