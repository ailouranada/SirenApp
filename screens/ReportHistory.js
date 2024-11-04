import { StyleSheet, Text, View, Pressable, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MI from "react-native-vector-icons/MaterialIcons";

import Container from "../components/Container";
import ReportCard from "../components/ReportCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "../firebase";

const ReportHistory = ({navigation}) => {

	const [reports, setReports] = useState([])

	useEffect(() => {
		init()
	},[])

	async function init() {
		const userId = await AsyncStorage.getItem('userId');
    const reportRef = ref(db, 'reports');
		const reportQuery = query(
      reportRef,
      orderByChild('senderId'), // Field to filter by
      equalTo(userId), // Value to match
    );

		get(reportQuery)
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(snapshot.val())
					const map = new Map(Object.entries(snapshot.val()));
          let reportList = [];
          for (let [key, value] of map) {
            console.log(`${key}: ${value}`);
            reportList.push({id: key, ...value});
          }
					setReports(reportList)
        } else {
          console.log('No matching data found');
          
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
	}

	return (
		<Container bg="#AFE8F3">
			<View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MI name="arrow-back-ios" size={40} color={'#D6F0F6'} />
        </TouchableOpacity>
        <Text style={styles.title}>Report History</Text>
			</View>

			<View style={styles.container}>
				{/* <ReportCard />
				<ReportCard status={true} /> */}
				<FlatList
              data={reports}
              renderItem={({item}) => (
                <ReportCard status={item.status} detail={item.details} />
              )}
              keyExtractor={item => item.id}
            />
			</View>
		</Container>
	);
};

export default ReportHistory;

const styles = StyleSheet.create({
	header: {
		paddingTop: 15,
		paddingBottom: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		backgroundColor: "#08B6D9",
		gap: 20,
		paddingHorizontal: 20,
		flexDirection: "row"
	},
	headerAction: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 30,
		color: "#D6F0F6",
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		width: "90%",
		marginHorizontal: "auto",
		backgroundColor: "#F0F1F2",
		paddingHorizontal: "3%",
	},
});
