import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SirenModal from "./SirenModal";

const Footer = ({navigation}) => {
	const [sirenClicked, setSirenClicked] = useState(false);

	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.wrapper}>
				<TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Dashboard")}>
					<Icon name="home" size={30} color={"#0C0C63"} />
					<Text style={styles.iconText}>Home</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Contact")}>
					<Icon name="contacts" size={30} color={"#0C0C63"} />
					<Text style={styles.iconText}>Contacts</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.icon}
					onPress={() => setSirenClicked(!sirenClicked)}
				>
					<Icon name="bell-ring" size={30} color={"#0C0C63"} />
					<Text style={[styles.iconText, { fontWeight: "bold" }]}>SIREN</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Messaging")}>
					<Icon name="message-processing" size={30} color={"#0C0C63"} />
					<Text style={styles.iconText}>Message</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.icon} onPress={() => navigation.navigate("Profile")}>
					<Icon name="account" size={30} color={"#0C0C63"} />
					<Text style={styles.iconText}>Profile</Text>
				</TouchableOpacity>
			</View>

			<SirenModal visible={sirenClicked}  navigation={navigation}/>
		</KeyboardAvoidingView>
	);
};

export default Footer;

const styles = StyleSheet.create({
	container: {
		width: "90%",
		marginHorizontal: "auto",
		position: "relative",
		zIndex: 1,
	},
	wrapper: {
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 15,
		padding: 15,
		zIndex: 1,
		backgroundColor: "#93E0EF",
	},
	icon: {
		alignItems: "center",
		gap: 5,
		height: 60,
		justifyContent: "space-between",
		paddingTop: 5,
	},
	iconText: {
		color: "#0C0C63",
		fontWeight: "bold",
	},
});
