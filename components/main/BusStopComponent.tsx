import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import BusComponent from "./BusComponent";
import fetchBusArrival, { BusArrivalData } from "../fetchBusArrival";
import * as Font from 'expo-font';

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
};

// font style
const fetchFonts = () => {
  return Font.loadAsync({
    'SpaceMono-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    'Nunito-Medium': require('../../assets/fonts/Nunito/Nunito-Medium.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito/Nunito-Bold.ttf')
  });
};

const BusStopComponent: React.FC<BusStopComponentProps> = ({
  BusStopCode,
  Description,
  RoadName,
  Distance,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);

  fetchFonts();
  // Fetch bus arrival data every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const data = await fetchBusArrival(BusStopCode);
        setBusArrivalData(data); // Set the fetched bus data
      } catch (error) {
        console.error("Failed to fetch bus data", error);
      }
    }, 5000); // 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [BusStopCode]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text style={styles.header}>
          {BusStopCode} | {Description} | {RoadName} | {Distance}m
        </Text>
      </TouchableOpacity>

      {/* When user press on bus stop */}
      {!isCollapsed && busArrivalData && (
        Object.entries(busArrivalData).map(([busNumber, timings]) => (
          <BusComponent
            key={busNumber}
            busNumber={busNumber}
            firstArrival={timings[0] || "No data"}
            secondArrival={timings[1] || "No data"}
            thirdArrival={timings[2] || "No data"}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: scale(340),
    // height: verticalScale(50),
    backgroundColor: 'blue',
  },
  header: { 
    backgroundColor: "#FF7F7F",
    // height: verticalScale(150),
    fontSize: 18,
    fontFamily: 'Nunito-Bold'
  },
});

export default BusStopComponent;
