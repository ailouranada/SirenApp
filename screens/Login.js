import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	TouchableOpacity,
	Alert,
	Modal,
	Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Container from "../components/Container";
import { auth, db } from "../firebase";
import {
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";
import { ref, get } from "firebase/database";

import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width;

const Login = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
	const [resetEmail, setResetEmail] = useState("");

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

	const handleLogin = async () => {
		if (username.trim() === "" || password.trim() === "") {
			Alert.alert("Error", "Username and Password are required.");
			return;
		}

		try {
			const userRef = ref(db, "users");
			const snapshot = await get(userRef);
			const users = snapshot.val();

			let userFound = false;
			let userEmail = "";
			let userRole = "";

			for (const userId in users) {
				if (users[userId].username === username) {
					userFound = true;
					userEmail = users[userId].email;
					userRole = users[userId].role; // Fetch the user's role
					console.log(users[userId])
					break;
				}
			}

			if (!userFound) {
				Alert.alert("Error", "Username does not exist.");
				return;
			}

			// Sign in with Firebase Auth
			const user = await signInWithEmailAndPassword(auth, userEmail, password);
			await AsyncStorage.setItem('userId', user.user.uid);
			await AsyncStorage.setItem('user', JSON.stringify(user.user));
			await AsyncStorage.setItem('role', userRole);

			// Check user role and navigate accordingly
			if (userRole === "responder") {
				navigation.replace("ResponderSide");
			} else {
				navigation.replace("Dashboard");
			}
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};

	const handleForgotPassword = async () => {
		if (resetEmail.trim() === "") {
			Alert.alert("Error", "Please enter your email address.");
			return;
		}

		try {
			await sendPasswordResetEmail(auth, resetEmail);
			Alert.alert("Success", "Password reset link sent to your email.");
			setShowForgotPasswordModal(false); // Close the modal
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};

	return (
		<Container bg="#0C0C63">
			<View style={styles.logoContainer}>
				<Image
					source={require("../assets/siren_icon.png")}
					style={styles.logo}
				/>
				<Image
					source={require("../assets/siren_text.png")}
					style={[styles.logo, styles.logoText]}
				/>
			</View>

			<View style={styles.formContainer}>
				<View style={styles.whiteLine} />
				<View style={styles.inputContainer}>
					<Icon
						name="user"
						size={30}
						color={"#000"}
						style={[styles.icon, styles.label]}
					/>
					<TextInput
						placeholder="Username"
						style={styles.input}
						value={username}
						onChangeText={setUsername}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Icon
						name="lock"
						size={30}
						color={"#000"}
						style={[styles.icon, styles.label]}
					/>
					<TextInput
						placeholder="Password"
						style={styles.input}
						secureTextEntry={!showPassword}
						value={password}
						onChangeText={setPassword}
					/>
					<Pressable onPress={() => setShowPassword(!showPassword)}>
						<Icon
							name={showPassword ? "eye" : "eye-slash"}
							size={30}
							color={"#5997C6"}
							style={[styles.icon, styles.label]}
						/>
					</Pressable>
				</View>

				<TouchableOpacity style={styles.submit} onPress={handleLogin}>
					<Text style={styles.submitText}>Login</Text>
				</TouchableOpacity>
				<Pressable onPress={() => setShowForgotPasswordModal(true)}>
					<Text style={styles.forgotPass}>Forgot Password?</Text>
				</Pressable>
			</View>

			<KeyboardAvoidingView style={styles.thirdparty} behavior="height">
				<Text style={styles.forgotPass}>Or Connect With</Text>

				<View style={styles.thirdpartyButtonContainer}>
					<Icon name="facebook-square" size={40} color={"#087BB8"} />
					<Icon name="user" size={40} color={"#087BB8"} />
					<Icon name="google" size={40} color={"#087BB8"} />
				</View>

				<View style={styles.askToRegister}>
					<Text style={styles.normalRegisterText}>Don't have an account?</Text>
					<Pressable onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.registerText}>Signup</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>

			{/* Forgot Password Modal */}
			<Modal
				transparent={true}
				visible={showForgotPasswordModal}
				animationType="slide"
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Reset Password</Text>
						<TextInput
							placeholder="Enter your email"
							style={styles.modalInput}
							value={resetEmail}
							onChangeText={setResetEmail}
						/>
						<TouchableOpacity
							style={styles.modalButton}
							onPress={handleForgotPassword}
						>
							<Text style={styles.modalButtonText}>Send Reset Link</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowForgotPasswordModal(false)}>
							<Text style={styles.modalCloseText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Container>
	);
};

export default Login;

const styles = StyleSheet.create({
	logoContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		resizeMode: "stretch",
		width: "40%",
		height: screenWidth * 0.35,
	},
	logoText: {
		height: screenWidth * 0.15,
	},

	formContainer: {
		flex: 1,
		position: "relative",
	},
	whiteLine: {
		borderTopWidth: 3,
		borderColor: "#fff",
		width: "30%",
		marginHorizontal: "auto",
		marginBottom: 20,
	},

	inputContainer: {
		flexDirection: "row",
		width: "70%",
		backgroundColor: "#fff",
		marginHorizontal: "auto",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 30,
		marginVertical: 10,
	},
	input: {
		flex: 1,
		marginLeft: 10,
	},

	submit: {
		width: "40%",
		marginHorizontal: "auto",
		backgroundColor: "#93E0EF",
		marginTop: 20,
		padding: 10,
		borderRadius: 50,
	},
	submitText: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
		color: "#0C0C63",
	},
	forgotPass: {
		textAlign: "center",
		color: "#fff",
		marginVertical: 10,
	},
	thirdpartyButtonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 15,
		marginBottom: 10,
	},
	askToRegister: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
		marginBottom: 20,
	},
	normalRegisterText: {
		color: "white",
	},
	registerText: {
		fontWeight: "bold",
		color: "#93E0EF",
	},

	// Forgot Password Modal Styles
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalInput: {
		width: "100%",
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		marginBottom: 20,
	},
	modalButton: {
		backgroundColor: "#93E0EF",
		padding: 10,
		borderRadius: 5,
		width: "100%",
		alignItems: "center",
	},
	modalButtonText: {
		color: "#0C0C63",
		fontWeight: "bold",
	},
	modalCloseText: {
		color: "#007BFF",
		marginTop: 10,
		fontWeight: "bold",
	},
});
