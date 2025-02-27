import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../../assets/styles/GlobalStyles';
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { useLikedBuses } from "../context/likedBusesContext";

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
  lastUpdated?: Date;
};

type LikedBusesBusComponent = {
  busNumber: string;
  busStopCode: string;
  groupName: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
};

const LikedBusesBusComponent: React.FC<LikedBusesBusComponent> = (props) => {
  const { toggleUnlike } = useLikedBuses();

  const handleHeartPress = async () => {
    await toggleUnlike(props.groupName, props.busStopCode, props.busNumber);
  };

  return (
    <View style={styles.container}>
      {/* Bus Number */}
      <View style={styles.busNumberWrapper}>
        <Text style={styles.busNumber} adjustsFontSizeToFit numberOfLines={1}>
          {props.busNumber}
        </Text>
      </View>

      {/* Timings Wrapper */}
      <View style={styles.busInfoWrapper}>
        {props.nextBuses.map((arrival, index) => (
          <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
        ))}
      </View>

      {/* Like Button */}
      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity onPress={handleHeartPress}>
          <Ionicons
            name={props.isHearted ? "heart" : "heart-outline"}
            color={props.isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
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
    paddingLeft: scale(8),
    paddingRight: scale(8),
    borderRadius: scale(4),
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
    marginRight: scale(16),
  },
  busNumber: {
    fontSize: scale(19),
    fontWeight: "bold",
    color: colors.secondary,
  },
  busInfoWrapper: {
    flex: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: scale(14),
  },
  likeButtonWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

export default LikedBusesBusComponent;

