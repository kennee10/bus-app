import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { colors, font } from '../../assets/styles/GlobalStyles';


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
        <Text
        style={styles.busNumber}
        adjustsFontSizeToFit
        numberOfLines={1}
        >
          {props.busNumber}
        </Text>
      </View>

      {/* Timings Wrapper */}
      <View style={styles.busInfoWrapper}>
        {/* <Text style={styles.busStopCode}>{props.busStopCode}</Text> */}
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
            color={props.isHearted ? colors.accent3 : colors.onSurfaceSecondary2}
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
    padding: scale(5),
    backgroundColor: colors.surface2,
    // backgroundColor: "#FFE4E1",
    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  busNumberWrapper: {
    flex: 2,
    alignItems: "center",
    marginRight: scale(14),
    // backgroundColor: "green"
  },
  busNumber: {
    fontFamily: "Arial",
    fontSize: scale(16),
    fontWeight: "bold",
    color: colors.onSurface
  },

  busInfoWrapper: {
    flex: 12,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginRight: scale(14),
    // backgroundColor: 'red'
  },

  likeButtonWrapper: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: 'purple'
  }
});

export default BusComponent;
