import {
	Platform,
	StatusBar,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";

import Footer from "./Footer";
import SearchInMap from "./SearchInMap";

import warning from "../assets/warning.png"
import safe from "../assets/secure.png"
import evac from "../assets/evacuation.png"


const Options = ({ path, text }) => (
	<TouchableOpacity style={styles.option}>
		<Image source={path} style={styles.optionIcon} />
		<Text style={styles.optionText}>{text}</Text>
	</TouchableOpacity>
);

const MapContent = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<SearchInMap />
			<View style={styles.options}>
				<Options
					path={warning}
					text={"Reported Emergencies"}
				/>
				<Options
					path={safe}
					text={"Safe zone"}
				/>
				<Options
					path={warning}
					text={"Evacuation"}
				/>
			</View>
			<View style={styles.mapContent} />
			<Footer navigation={navigation} />
		</View>
	);
};

export default MapContent;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		height: "100%",
		width: "100%",
		marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
	},

	mapContent: {
		flex: 1,
	},
	options: {
		width: "90%",
		flexDirection: "row",
		gap: 5,
		marginHorizontal: "auto",
		marginTop: 10,
        justifyContent: "center"
	},
	option: {
		flexDirection: "row",
		gap: 5,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 5,
	},
	optionText: {
		fontSize: 11,
	},
});
