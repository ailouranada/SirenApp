import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Header = ({ responder = false }) => {
	return (
		<View style={styles.container}>
			{/* <Pressable>
				<Icon name="bell" size={40} color={"#93E0EF"} />
			</Pressable> */}
			<Pressable>
				{responder ? (
					<Image source={require("../assets/policeman.png")} style={styles.police}/>
				) : (
					<Icon name="user-circle" size={40} color={"#93E0EF"} />
				)}
			</Pressable>
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		paddingHorizontal: 20,
		gap: 20,
	},
	police:{
		resizeMode: "stretch",
		height: 50, 
		width: 50
	}
});
