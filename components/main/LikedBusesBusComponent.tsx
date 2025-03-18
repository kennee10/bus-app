import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../../assets/styles/GlobalStyles';
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { useLikedBuses } from "../context/likedBusesContext";
import LikedBusesBusModal from "./LikedBusesBusModal";

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
  description?: string;
  groupName: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
};

const LikedBusesBusComponent: React.FC<LikedBusesBusComponent> = (props) => {
  const { toggleUnlike } = useLikedBuses();
  const [isBusModalVisible, setBusModalVisible] = useState(false);

  const handleHeartPress = async () => {
    await toggleUnlike(props.groupName, props.busStopCode, props.busNumber);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setBusModalVisible(true);
        }}
        style={styles.touchableOpacity}
      >
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
      </TouchableOpacity>
      

      {/* Like Button */}
        <TouchableOpacity onPress={handleHeartPress} style={styles.likeButtonWrapper}>
          <Ionicons
            name={props.isHearted ? "heart" : "heart-outline"}
            color={props.isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
            size={18}
          />
        </TouchableOpacity>
      
      <LikedBusesBusModal
        busNumber={props.busNumber}
        busStopCode={props.busStopCode}
        description={props.description}
        groupName={props.groupName}
        isVisible={isBusModalVisible}
        onClose={() => setBusModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    backgroundColor: colors.surface2,
    
    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  touchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  likeButtonWrapper: {
    marginLeft: 16
  },
  busNumberWrapper: {
    flex: 2,
    alignItems: "center",
    marginRight: 16,
  },
  busNumber: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.secondary,
  },
  busInfoWrapper: {
    flex: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  
});

export default LikedBusesBusComponent;

