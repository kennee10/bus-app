import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";


type BusArrivalInfo = {
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  Load: string;
  Type: string;
};

type ArrivalTimingComponentProps = {
  arrivalInfo: BusArrivalInfo;
};


const ArrivalTimingComponent: React.FC<ArrivalTimingComponentProps> = ({
  arrivalInfo,
}) => {
  const { EstimatedArrival, Monitored, Latitude, Longitude, Load, Type } = arrivalInfo;
  
  // Format EstimatedArrival to a more readable time format
  const formattedArrivalTime = new Date(EstimatedArrival).toLocaleTimeString();

  return (
    <View style={styles.container}>
      <Text style={styles.timing}>
        Arrival: {formattedArrivalTime}
      </Text>
      <Text style={styles.detail}>Load: {Load}</Text>
      <Text style={styles.detail}>Type: {Type}</Text>
      <Text style={styles.detail}>Monitored: {Monitored}</Text>
      <Text style={styles.detail}>
        Location: {Latitude}, {Longitude}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(10),
    padding: scale(5),
    backgroundColor: "#f9f9f9",
    borderRadius: scale(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timing: {
    fontSize: scale(14),
    fontWeight: "bold",
    marginBottom: scale(4),
  },
  detail: {
    fontSize: scale(12),
    color: "gray",
  },
});

export default ArrivalTimingComponent;
