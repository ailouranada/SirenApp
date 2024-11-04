import React, { useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Text,
	Platform,
	Modal,
	Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimeInput = ({
	placeholder,
	style,
	inputStyle,
	placeholderTextColor,
}) => {
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState("datetime");
	const [displayText, setDisplayText] = useState("");

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setDisplayText(currentDate.toLocaleString());
    setShow(false);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDateTimePicker = () => {
		showMode("datetime");
	};

	return (
		<View style={[styles.container, style]}>
			<TouchableOpacity onPress={showDateTimePicker}>
				<TextInput
					style={[styles.input, inputStyle]}
					placeholder={placeholder}
					placeholderTextColor={placeholderTextColor || "#aaa"}
					value={displayText}
					editable={false}
				/>
			</TouchableOpacity>
			{show && (
				<DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode={mode}
        is24Hour={true}
        display="default"
        onChange={onChange}
        style={styles.picker}
      />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		backgroundColor: "#fff",
		color: "#000",
	},
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContainer: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	picker: {
		width: "100%",
	},
});

export default DateTimeInput;
