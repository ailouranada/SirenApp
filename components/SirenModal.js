import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Image, Pressable, Animated } from "react-native";
import F5Icon from "react-native-vector-icons/FontAwesome5";
import F6Icon from "react-native-vector-icons/FontAwesome6";

const SirenModal = ({ visible, navigation }) => {
	const scaleAnim = useRef(new Animated.Value(0)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacityAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(scaleAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacityAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [visible]);

	const handleNavigate = (path) => {
		if (!visible) {
			return;
		} else {
			navigation.navigate(path);
		}
	};

	return (
		<Animated.View
			style={[
				styles.modal,
				{
					transform: [{ scale: scaleAnim }],
					opacity: opacityAnim,
				},
			]}
		>
			<View style={styles.modalWrapper}>
				{/* <Pressable
					style={{ display: visible ? "flex" : "none" }}
					onPress={() => handleNavigate("CommunitySupport")}
				>
					<F5Icon size={30} name="hands-helping" color={"#0C0C63"} />
				</Pressable>
				<Pressable
					style={{ display: visible ? "flex" : "none" }}
					onPress={() => handleNavigate("Educational")}
				>
					<F5Icon size={30} name="graduation-cap" color={"#0C0C63"} />
				</Pressable> */}
				<Pressable
					style={{ display: visible ? "flex" : "none" }}
					onPress={() => handleNavigate("Map")}
				>
					<F5Icon size={30} name="map-marked" color={"#0C0C63"} />
				</Pressable>
				<Pressable
					style={{ display: visible ? "flex" : "none" }}
					onPress={() => handleNavigate("ReportHistory")}
				>
					<F5Icon size={30} name="history" color={"#0C0C63"} />
				</Pressable>
				{/* <Pressable
					style={{ display: visible ? "flex" : "none" }}
					onPress={() => handleNavigate("Setting")}
				>
					<F6Icon size={30} name="gear" color={"#0C0C63"} />
				</Pressable> */}
			</View>
			<Image
				source={require("../assets/arrowdown.png")}
				style={styles.arrowDown}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	modal: {
		position: "absolute",
		width: "100%",
		top: -85,
	},
	arrowDown: {
		resizeMode: "stretch",
		width: 30,
		height: 30,
		marginVertical: 0,
		marginHorizontal: "auto",
	},
	modalWrapper: {
		marginVertical: 0,
		backgroundColor: "#5997C6",
		paddingVertical: 10,
		flexDirection: "row",
		borderRadius: 5,
		justifyContent: "space-evenly",
	},
});

export default SirenModal;
