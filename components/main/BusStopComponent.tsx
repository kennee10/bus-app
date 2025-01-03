import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, font } from '../../assets/styles/GlobalStyles';
import BusComponent from "./BusComponent";
import fetchBusArrival, { BusArrivalData } from "../apis/fetchBusArrival";
// FROM CONTEXT
import { useLikedBuses } from "../context/likedBusesContext";

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
  isLiked: boolean;
  onLikeToggle: (busStopCode: string) => void;
};

const BusStopComponent: React.FC<BusStopComponentProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // FROM CONTEXT
  const { likedBuses, toggleLike } = useLikedBuses();


  // Refresh bus arrival timings
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const data = await fetchBusArrival(props.BusStopCode);
        setBusArrivalData(data); // Set the fetched bus data
      } catch (error) {
        console.error("BusStopComponent.tsx: Failed to fetch bus data, error: ", error);
      } finally {
        setIsLoading(false);
      }
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [props.BusStopCode]);


  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.container}>
        {/* Upper */}
        <View style={styles.upper}>
          <View style={styles.busStopCodeWrapper}>
            <Text style={styles.busStopCode}>{props.BusStopCode}</Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>
              {props.Description}
            </Text>
          </View>
          <View
            style={styles.likeButtonWrapper}
            onStartShouldSetResponder={() => true} // Prevent touch from propagating to parent
          > 
            <TouchableOpacity onPress={() => props.onLikeToggle(props.BusStopCode)}>
              <Ionicons
                name={props.isLiked ? "star" : "star-outline"}
                color={props.isLiked ? "gold" : "gray"}
                size={scale(21)}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Lower */}
        <View style={styles.lower}>
          <View style={styles.distanceWrapper}>
            <Text style={styles.distance}>{props.Distance}m</Text>
          </View>
          <View style={styles.roadNameWrapper}>
            <Text style={styles.roadName}>{props.RoadName}</Text>
          </View>

          <View style={styles.blackSpace2}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Bus arrival timings */}
      {!isCollapsed && (
        <View style={styles.busesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="gray" />
          ) : busArrivalData && Object.keys(busArrivalData).length > 0 ? (
            Object.entries(busArrivalData).map(([busNumber, timings]) => (
              <BusComponent
                key={busNumber}
                busNumber={busNumber}
                busStopCode={props.BusStopCode}
                firstArrival={timings[0] || "No data"}
                secondArrival={timings[1] || "No data"}
                thirdArrival={timings[2] || "No data"}
                isHearted={likedBuses.some(
                  ([code, service]) => code === props.BusStopCode && service === busNumber

              )}
                onHeartToggle={toggleLike}
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
    marginBottom: verticalScale(10),
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
  // Upper
  busStopCodeWrapper: {
    flex: 6,
    // backgroundColor: 'red'
  },
  descriptionWrapper: {
    flex: 19,
    // backgroundColor: 'blue'
  },
  likeButtonWrapper: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
    // paddingRight: scale(7),
    // backgroundColor: 'green'
  },
  busStopCode: {
    fontSize: scale(14),
    lineHeight: scale(30),
    paddingLeft: scale(5),
    fontFamily: font.bold,
    color: colors.text,
  },
  description: {
    fontSize: scale(16.5),
    lineHeight: scale(30),
    fontFamily: font.bold,
    color: colors.text,
  },
  // Lower
  distanceWrapper: {
    flex: 6,
    height: scale(25),
    justifyContent: 'center',
    // backgroundColor: 'red',
    
  },
  roadNameWrapper: {
    flex: 19,
    height: scale(25),
    paddingBottom: scale(2),
    justifyContent: 'center',
    // backgroundColor: 'blue'
  },
  blackSpace2: {
    flex: 2.5,
    // backgroundColor: 'green'
  },
  distance: {
    fontSize: scale(10),
    paddingLeft: scale(5),
    textAlign: "left",
    fontFamily: font.bold,
    color: colors.accent,
    // backgroundColor: 'green'
  },
  roadName: {
    fontSize: scale(14),
    fontFamily: font.bold,
    color: colors.accent,
    // backgroundColor: 'green'
  },
  busesContainer: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  noBusesText: {
    flex: 1,
    fontFamily: font.bold,
    color: "red",
    textAlign: "center",
  },
});

export default BusStopComponent;
