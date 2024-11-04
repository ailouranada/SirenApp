import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ReportCard = ({ status = "Reported", detail}) => {
	return (
		<View style={styles.reportContainer}>
			<Image style={styles.profile} source={require("../assets//woman.png")} />
			<View
				style={[
					styles.report,
					{
						backgroundColor: status === "Responded" ? "green" : status === "Reported" ? "lightblue" : "red",
					},
				]}
			>
				<Text style={styles.reportTitle}>
					{status.toUpperCase()}
				</Text>
				<Text style={styles.reportText}>
					{detail}
				</Text>
			</View>
		</View>
	);
};

export default ReportCard;

const styles = StyleSheet.create({
	reportContainer: {
		flexDirection: "row",
		gap: 10,
		marginVertical: 10,
		alignItems: "flex-start",
	},
	profile: {
		resizeMode: "stretch",
		width: 50,
		height: 50,
	},
	report: {
		flex: 1,
		borderRadius: 10,
		padding: 10,
	},
	reportTitle: {
		fontSize: 20,
		color: "white",
		fontWeight: "bold",
	},
	reportText: {
		fontSize: 16,
		color: "white",
	},
});
