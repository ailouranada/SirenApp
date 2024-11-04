import React, { useEffect, useState } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { useFonts } from "expo-font";
import Container from "../components/Container";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signup = ({ navigation }) => {

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// useEffect(() => {
	// 	async function prepare() {
	// 		if (!fontsLoaded) {
	// 			SplashScreen.show();
	// 		} else {
	// 			SplashScreen.hide();
	// 		}
	// 	}
	// 	prepare();
	// }, [fontsLoaded]);

	// if (!fontsLoaded) {
	// 	return null;
	// }

	useEffect(() => {
		(async() => {
			const role = await AsyncStorage.getItem('role');
			const userId = await AsyncStorage.getItem('userId');
			if(userId) {
				if (role === "responder") {
					navigation.replace("ResponderSide");
				} else {
					navigation.replace("Dashboard");
				}
			}

		})()
	},[])

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleSignup = async () => {
		if (username.length < 3) {
			Alert.alert("Error", "Username must be at least 3 characters long.");
			return;
		}
		if (password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters long.");
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}
		if (!validateEmail(email)) {
			Alert.alert("Error", "Invalid email format.");
			return;
		}

		try {
			const userRef = ref(db, "users");
			const snapshot = await get(userRef);
			const existingUsers = snapshot.val();

			for (const userId in existingUsers) {
				if (existingUsers[userId].username === username) {
					Alert.alert("Error", "Username already exists.");
					return;
				}
				if (existingUsers[userId].email === email) {
					Alert.alert("Error", "Email already exists.");
					return;
				}
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const userId = userCredential.user.uid;

			Alert.alert("Responder", "Are you a responder?", [
				{
					text: "Yes",
					onPress: async () => {
						await set(ref(db, `users/${userId}`), {
							username,
							email,
							role: "responder",
						});
						navigation.navigate("Login");
					},
				},
				{
					text: "No",
					onPress: async () => {
						await set(ref(db, `users/${userId}`), {
							username,
							email,
							role: "user",
						});
						navigation.navigate("Login");
					},
				},
			]);
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};

	return (
		<Container bg="#D7F1F7">
			<Image
				source={require("../assets/top_image.png")}
				style={styles.topImage}
			/>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Text style={styles.signupText}>Signup</Text>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Username</Text>
					<TextInput
						placeholder="Username"
						style={styles.input}
						value={username}
						onChangeText={setUsername}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						placeholder="i.e john@gmail.com"
						style={styles.input}
						value={email}
						onChangeText={setEmail}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						placeholder="Create a strong password"
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Confirm Password</Text>
					<TextInput
						placeholder="Re-type password"
						style={styles.input}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>
				</View>
				<TouchableOpacity style={styles.signup} onPress={handleSignup}>
					<Text style={styles.createAccountText}>Create Account</Text>
				</TouchableOpacity>

				<View style={styles.hasAccount}>
					<Text style={styles.hasAccountQuestion}>
						Already have an account?
					</Text>
					<Pressable onPress={() => navigation.navigate("Login")}>
						<Text style={styles.loginLink}>Signin</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</Container>
	);
};

export default Signup;

const styles = StyleSheet.create({
	topImage: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	signupText: {
		color: "#0B0C63",
		fontSize: 60,
		fontFamily: "DmSansBold",
		marginVertical: 40,
		paddingLeft: 20,
	},
	inputContainer: {
		width: "80%",
		marginHorizontal: "auto",
		gap: 5,
		marginBottom: 15,
	},
	label: {
		fontSize: 18,
		fontFamily: "DmSansBold",
		color: "#0C0C63",
		paddingLeft: 20,
	},
	input: {
		borderWidth: 2,
		borderColor: "#0C0C63",
		borderRadius: 20,
		paddingHorizontal: 20,
		fontSize: 18,
		paddingVertical: 5,
		backgroundColor: "#AFE8F3",
	},
	signup: {
		width: "80%",
		marginHorizontal: "auto",
		backgroundColor: "#0B0C63",
		padding: 10,
		borderRadius: 30,
		marginVertical: 20,
	},
	createAccountText: {
		color: "#AFE8F3",
		textAlign: "center",
		fontSize: 20,
		fontFamily: "DmSansBold",
	},
	hasAccount: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
		marginTop: 15,
	},
	hasAccountQuestion: {
		color: "#0C0C63",
		fontSize: 18,
	},
	loginLink: {
		fontWeight: "bold",
		fontSize: 18,
		color: "#0C0C63",
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
});
