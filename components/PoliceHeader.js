import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MCI from "react-native-vector-icons/MaterialCommunityIcons";

const PoliceHeader = () => {
	return (
		<View style={styles.header}>
			{/* <Pressable>
				<MCI size={40} name="menu" color={"#08B6D9"} />
			</Pressable> */}
			<Image
				source={require("../assets/policeman.png")}
				style={{
					resizeMode: "stretch",
					width: 40,
					height: 40,
				}}
			/>
			<View style={styles.userInfo}>
				<Text style={styles.name}>Lorem Ipsum</Text>
				<Text style={styles.number}>09876768123</Text>
			</View>

			<View style={styles.buttons}>
				<Pressable>
					<MCI name="information" size={30} color={"#08B6D9"} />
				</Pressable>
			</View>
		</View>
	);
};

export default PoliceHeader;

const styles = StyleSheet.create({
	header: {
		height: "12%",
		backgroundColor: "#0B0C63",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		gap: 15,
	},
	buttons: {
		flexDirection: "row",
		gap: 5,
	},
	userInfo: {
		flex: 1,
	},
	name: {
		color: "#08B6D9",
		fontSize: 15,
		fontWeight: "bold",
	},
	number: {
		color: "#08B6D9",
		fontSize: 14,
		fontWeight: "semibold",
	},
});
