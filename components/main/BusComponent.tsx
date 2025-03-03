import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Touchable } from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../assets/styles/GlobalStyles";
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import GroupSelectionModal from "./GroupSelectionModal";
import BusModal from "./BusModal";

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
  description: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
};

const BusComponent: React.FC<BusComponentProps> = ({ busNumber, busStopCode, description, nextBuses, isHearted }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBusModalVisible, setBusModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setBusModalVisible(true);
        }}
        style={styles.touchableOpacity}
      >
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
      </TouchableOpacity>
        
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.likeButtonWrapper}>
        <Ionicons
          name="heart-outline"
          color={isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
          size={scale(18)}
        />
      </TouchableOpacity>

      <GroupSelectionModal
        busNumber={busNumber}
        busStopCode={busStopCode}
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      <BusModal
        busNumber={busNumber}
        busStopCode={busStopCode}
        description={description}
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
    paddingLeft: scale(8),
    paddingRight: scale(8),
    margin: scale(2.5),
    marginLeft: scale(5),
    marginRight: scale(5),
    borderRadius: scale(4),
    elevation: 2,
    backgroundColor: colors.surface2,
  },
  touchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  likeButtonWrapper: {
    marginLeft: scale(14)
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
  },
});

export default BusComponent;
