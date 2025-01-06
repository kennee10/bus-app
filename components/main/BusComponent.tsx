import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import ArrivalTimingComponent from "./ArrivalTimingComponent";


type NextBusInfo = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
};

type BusComponentProps = {
  busNumber: string;
  busStopCode: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
  onHeartToggle: (busStopCode: string, serviceNo: string) => void;
};


const BusComponent: React.FC<BusComponentProps> = (props) => {
  return (
    <View style={styles.container}>
      {/* Bus Number */}
      <View style={styles.busNumberWrapper}>
        <Text style={styles.busNumber}>{props.busNumber}</Text>
      </View>

      {/* Timings Wrapper */}
      <View style={styles.timingsWrapper}>
        <Text style={styles.busStopCode}>{props.busStopCode}</Text>
        {/* arrival: Represents the current element of the array
            index: Represents the current index*/}
        {props.nextBuses.map((arrival, index) => (
          <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
        ))}
      </View>

      {/* Like Button */}
      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity
          onPress={() => props.onHeartToggle(props.busStopCode, props.busNumber)}
        >
          <Ionicons
            name={props.isHearted ? "heart" : "heart-outline"}
            color={props.isHearted ? "red" : "gray"}
            size={scale(18)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(10),
    backgroundColor: "white",
    borderRadius: scale(4),
    marginVertical: verticalScale(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  busNumberWrapper: {
    flex: 1,
    alignItems: "center",
  },
  busNumber: {
    fontSize: scale(16),
    fontWeight: "bold",
  },
  timingsWrapper: {
    flex: 3,
    paddingHorizontal: scale(10),
  },
  likeButtonWrapper: {
    flex: 0.5,
    alignItems: "center",
  },
  busStopCode: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
});

export default BusComponent;
