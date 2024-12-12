import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BusComponent from "./BusComponent";
import fetchBusArrival, { BusArrivalData } from "../fetchBusArrival";

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
};

const BusStopComponent: React.FC<BusStopComponentProps> = ({
  BusStopCode,
  Description,
  RoadName,
  Distance,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);

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
          Bus Stop: {BusStopCode} | {Description} | {RoadName} | {Distance}m
        </Text>
      </TouchableOpacity>

      {!isCollapsed && busArrivalData && (
        // Render the bus data dynamically
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
    width: '100%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { backgroundColor: "#f0f0f0", padding: 10 },
  title: { fontSize: 18 },
  busNumber: { color: 'blue' },
});

export default BusStopComponent;
