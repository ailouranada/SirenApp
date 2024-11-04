import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";

const SearchInMap = () => {
  return (
		<View style={styles.searchBar}>
			<TextInput placeholder="Search here" style={styles.search} />
			<Icon
				name="microphone"
				size={25}
				color={"#0B0C63"}
				style={styles.searchIcon}
			/>
			<Icon name="user" size={25} color={"#0B0C63"} style={styles.searchIcon} />
		</View>
	);
}

export default SearchInMap

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: "row",
		marginTop: "10%",
		width: "80%",
		marginHorizontal: "auto",
		backgroundColor: "white",
		padding: 10,
		borderRadius: 10,
		overflow: "hidden",
	},
	search: {
		flex: 1,
	},
	searchIcon: {
		marginHorizontal: 5,
	},
});