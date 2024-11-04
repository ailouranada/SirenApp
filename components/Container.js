import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";

const Container = ({ children, bg = "#fff" }) => {
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: bg,
				},
			]}
		>
			{children}
		</View>
	);
};

export default Container;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    marginTop: 0,
		position: "relative",
		overflow: "hidden",
	},
});
