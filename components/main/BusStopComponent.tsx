import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, font } from '../../assets/styles/GlobalStyles';
import BusComponent from "./BusComponent";
import fetchBusArrival from "../apis/fetchBusArrival";
import { useLikedBuses } from "../context/likedBusesContext";


type BusArrivalInfo = {
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

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
  isLiked: boolean;
  onLikeToggle: (busStopCode: string) => void;
  searchQuery: string;
};


const BusStopComponent: React.FC<BusStopComponentProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initial state is collapsed
  const [busArrivalData, setBusArrivalData] = useState<BusService[]>([]); // Array of BusService
  const [isLoading, setIsLoading] = useState(true);
  const { likedBuses, toggleLike, createGroup } = useLikedBuses();

  // GETTING ARRIVAL DATA
  useEffect(() => {
    let intervalId;

    const fetchAndSetBusArrivalData = async () => {
      try {
        const data = await fetchBusArrival(props.BusStopCode);
        setBusArrivalData(data);
      } catch (error) {
        console.error("Failed to fetch bus data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data immediately when the component mounts
    fetchAndSetBusArrivalData();
    // Set up the interval to fetch data every 5 seconds
    intervalId = setInterval(fetchAndSetBusArrivalData, 5000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.container}>
        {/* Upper Section */}
        <View style={styles.upper}>
          <View style={styles.busStopCodeWrapper}>
            <Text style={styles.busStopCode}>{props.BusStopCode}</Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description} adjustsFontSizeToFit numberOfLines={1}>
              {props.searchQuery
                ? props.Description.split(new RegExp(`(${props.searchQuery})`, 'i')).map((part, index) =>
                    part.toLowerCase() === props.searchQuery.toLowerCase() ? (
                      <Text key={index} style={styles.highlight}>
                        {part}
                      </Text>
                    ) : (
                      part
                    )
                  )
                : props.Description}
            </Text>
          </View>
          <View
            style={styles.likeButtonWrapper}
            onStartShouldSetResponder={() => true} // Prevent touch from propagating to parent
          >
            <TouchableOpacity onPress={() => props.onLikeToggle(props.BusStopCode)}>
              <Ionicons
                name={props.isLiked ? "star" : "star-outline"}
                color={props.isLiked ? colors.accent4 : colors.onSurfaceSecondary2}
                size={scale(21)}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Lower Section */}
        <View style={styles.lower}>
          <View style={styles.distanceWrapper}>
            <Text style={styles.distance}>{props.Distance}m</Text>
          </View>
          <View style={styles.roadNameWrapper}>
            <Text style={styles.roadName}>{props.RoadName}</Text>
          </View>
          <View style={styles.blackSpace2}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.onSurfaceSecondary} />
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Bus arrival timings */}
      {!isCollapsed && (
        <View style={styles.busesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.onSurfaceSecondary} />
          ) : busArrivalData.length > 0 && busArrivalData[0].nextBuses.length > 0 ? (
            busArrivalData.map((busService, index) => (
              <BusComponent
                key={index}
                busNumber={busService.ServiceNo}
                busStopCode={props.BusStopCode}
                nextBuses={busService.nextBuses}
                isHearted={Object.values(likedBuses).some(
                  (group) => group[props.BusStopCode]?.includes(busService.ServiceNo)
                )}
                onHeartToggle={toggleLike}
              />
            ))
          ) : (
            <View style={styles.noBusesWrapper}>
              <Text style={styles.noBusesText}>
                No buses are currently in operation.
              </Text>
            </View>
            
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    color: colors.primary,
    fontFamily: font.bold,
  },
  outerContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    padding: scale(2),
    marginBottom: verticalScale(7),
    borderRadius: scale(4),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderToPress,
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
    flex: 6.1,
  },
  descriptionWrapper: {
    flex: 19,
  },
  likeButtonWrapper: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  busStopCode: {
    fontSize: scale(14),
    lineHeight: scale(30),
    paddingLeft: scale(7),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  description: {
    fontSize: scale(16.5),
    lineHeight: scale(30),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  distanceWrapper: {
    flex: 6.1,
    height: scale(25),
    justifyContent: 'center',
  },
  roadNameWrapper: {
    flex: 19,
    height: scale(25),
    paddingBottom: scale(2),
    justifyContent: 'center',
  },
  blackSpace2: {
    flex: 2.5,
  },
  distance: {
    fontSize: scale(10),
    paddingLeft: scale(7),
    textAlign: "left",
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
  },
  roadName: {
    fontSize: scale(14),
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
  },
  busesContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  noBusesWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(2.5),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  noBusesText: {
    flex: 1,
    fontFamily: font.bold,
    color: colors.warning,
    textAlign: "center",
  },
});

export default BusStopComponent;
