import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";

import Container from "../components/Container";

export default function Setting() {
	return (
		<Container>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Settings</Text>
				</View>
				<ScrollView style={styles.settingsList}>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Emergency Preparedness</Text>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Emergency Contact</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Notification</Text>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Notification Management</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Display</Text>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Font Size</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Font Style</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Dark Mode</Text>
							<Text style={styles.status}>Off</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Magnification</Text>
							<Text style={styles.status}>Off</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Accessibility Shortcut</Text>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Voice Command</Text>
							<Text style={styles.status}>Off</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Screen Reader</Text>
							<Text style={styles.status}>Off</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Color Accessibility Mode</Text>
							<Text style={styles.status}>Off</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>Vibration & Haptic</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.section}>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.sectionTitle}>Additional Settings</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#00BFFF",
	},
	header: {
		backgroundColor: "#000080",
		padding: 20,
		alignItems: "center",
	},
	headerText: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
	},
	settingsList: {
		padding: 10,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#0B0C63",
	},
	item: {
		backgroundColor: "#D3D3D3",
		padding: 15,
		marginBottom: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 5,
	},
	itemText: {
		fontSize: 16,
	},
	status: {
		fontSize: 16,
		color: "#808080",
	},
});
