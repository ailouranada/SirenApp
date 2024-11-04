import {
	Image,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React from "react";

const StyledContainer = ({ children, bg = "#D7f1f7" }) => {
	return (
		<View style={[styles.container, {backgroundColor: bg}]}>
			<Image source={require("../assets/top_image.png")} style={styles.image} />
			{children}
		</View>
	);
};

export default StyledContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
		marginTop: 0
	},
	image: {
		position: "absolute",
		top: 0,
		left: 0,
	},
});
