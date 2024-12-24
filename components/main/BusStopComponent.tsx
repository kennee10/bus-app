import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../../assets/styles/Colors';
import BusComponent from "./BusComponent";
import fetchBusArrival, { BusArrivalData } from "../fetchBusArrival";

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
  isLiked: boolean;
  onLikeToggle: (busStopCode: string) => void;
};

const BusStopComponent: React.FC<BusStopComponentProps> = ({
  BusStopCode,
  Description,
  RoadName,
  Distance,
  isLiked,
  onLikeToggle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const data = await fetchBusArrival(BusStopCode);
        setBusArrivalData(data); // Set the fetched bus data
      } catch (error) {
        console.error("Failed to fetch bus data", error);
      } finally {
        setIsLoading(false);
      }
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [BusStopCode]);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.container}>
        <View style={styles.upper}>
          <View style={styles.busStopCodeWrapper}>
            <Text style={styles.busStopCode}>{BusStopCode}</Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{Description}</Text>
          </View>
          <View style={styles.distanceWrapper}>
            <Text style={styles.distance}>{Distance}m</Text>
          </View>
          <View style={styles.likeButtonWrapper}>
            <TouchableOpacity onPress={() => onLikeToggle(BusStopCode)}>
              <Ionicons
                name={isLiked ? "star" : "star-outline"}
                color={isLiked ? "gold" : "gray"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lower}>
          <View style={styles.blackSpace1}></View>
          <View style={styles.roadNameWrapper}>
            <Text style={styles.roadName}>{RoadName}</Text>
          </View>

          <View style={styles.blackSpace2}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.busesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#666" />
          ) : busArrivalData && Object.keys(busArrivalData).length > 0 ? (
            Object.entries(busArrivalData).map(([busNumber, timings]) => (
              <BusComponent
                key={busNumber}
                busNumber={busNumber}
                firstArrival={timings[0] || "No data"}
                secondArrival={timings[1] || "No data"}
                thirdArrival={timings[2] || "No data"}
              />
            ))
          ) : (
            <Text style={styles.noBusesText}>
              No buses are currently in operation.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: scale(340),
    overflow: "hidden",
    marginTop: verticalScale(10),
    borderRadius: scale(4),
    backgroundColor: colors.secondaryBackground,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  upper: {
    flex: 1,
    height: scale(30),
    width: "100%",
    flexDirection: "row",
  },
  lower: {
    flex: 1,
    height: scale(25),
    width: "100%",
    flexDirection: "row",
  },
  busStopCodeWrapper: {
    flex: 6,
  },
  descriptionWrapper: {
    flex: 15,
  },
  distanceWrapper: {
    flex: 4,
  },
  likeButtonWrapper: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  busStopCode: {
    fontSize: scale(15),
    lineHeight: scale(30),
    paddingLeft: scale(5),
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },
  description: {
    fontSize: scale(18),
    lineHeight: scale(30),
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },
  distance: {
    fontSize: scale(12),
    lineHeight: scale(30),
    paddingRight: scale(5),
    textAlign: "right",
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },
  blackSpace1: {
    flex: 6,
  },
  roadNameWrapper: {
    flex: 15,
    height: scale(25),
  },
  blackSpace2: {
    flex: 6,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: scale(5),
  },
  roadName: {
    fontSize: scale(14),
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },
  busesContainer: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  noBusesText: {
    flex: 1,
    fontFamily: "Nunito-Bold",
    color: "red",
    textAlign: "center",
  },
});

export default BusStopComponent;
