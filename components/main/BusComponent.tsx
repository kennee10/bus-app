import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../assets/styles/GlobalStyles";
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { useLikedBuses } from "../context/likedBusesContext";
import GroupSelectionModal from "./GroupSelectionModal";

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

type BusComponentProps = {
  busNumber: string;
  busStopCode: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
};

const BusComponent: React.FC<BusComponentProps> = ({ busNumber, busStopCode, nextBuses, isHearted }) => {
  // const { toggleLike, createGroup, deleteGroup } = useLikedBuses();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.busNumberWrapper}>
        <Text style={styles.busNumber} adjustsFontSizeToFit numberOfLines={1}>
          {busNumber}
        </Text>
      </View>

      <View style={styles.busInfoWrapper}>
        {nextBuses.map((arrival, index) => (
          <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
        ))}
      </View>

      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons
            name="heart-outline"
            color={isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
            size={scale(18)}
          />
        </TouchableOpacity>
      </View>

      <GroupSelectionModal
        busNumber={busNumber}
        busStopCode={busStopCode}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    margin: scale(2.5),
    marginLeft: scale(5),
    marginRight: scale(5),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
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

export default BusComponent;
