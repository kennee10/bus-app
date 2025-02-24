import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, font } from "../../assets/styles/GlobalStyles";
import LikedBusesBusComponent from "./LikedBusesBusComponent";
import fetchBusArrival from "../apis/fetchBusArrival";
import { useLikedBuses } from "../context/likedBusesContext";
import { scale, verticalScale } from "react-native-size-matters";

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

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
  lastUpdated?: Date;
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};

type LikedBusesBusStopComponentProps = {
  busStopCode: string;
  groupName: string;
  likedServices: string[];
  busStopDetails?: BusStopWithDist;
};

const LikedBusesBusStopComponent: React.FC<LikedBusesBusStopComponentProps> = (props) => {
  const [busArrivalData, setBusArrivalData] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { groups, toggleLike } = useLikedBuses();

  // Getting bus timings
  useEffect(() => {
    let intervalId;
    let latestBusArrivalData = busArrivalData; // Create a local reference

    const fetchAndSetBusArrivalData = async () => {
      try {
        const fetchedData = await fetchBusArrival(props.busStopCode, props.likedServices);

        const updatedData = fetchedData.map((service: BusService) => ({
          ...service,
          nextBuses: service.nextBuses.map((bus: BusArrivalInfo, index: number) => {
            const existingBusService = latestBusArrivalData.find(
              (existingService) => existingService.ServiceNo === service.ServiceNo
            );
            const existingBus = existingBusService?.nextBuses[index];

            return {
              ...bus,
              lastUpdated:
                existingBus &&
                existingBus.EstimatedArrival === bus.EstimatedArrival &&
                existingBus.Latitude === bus.Latitude &&
                existingBus.Longitude === bus.Longitude
                  ? existingBus.lastUpdated
                  : new Date(),
            };
          }),
        }));

        latestBusArrivalData = updatedData;
        setBusArrivalData(updatedData);
      } catch (error) {
        console.error("BusStopComponent.tsx: Failed to fetch bus data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetBusArrivalData();
    intervalId = setInterval(fetchAndSetBusArrivalData, 3000);

    return () => clearInterval(intervalId);
  }, [groups]);

  // Find buses not in operation
  const busesNotInOperation = props.likedServices.filter(
    (service) => !busArrivalData.some((bus) => bus.ServiceNo === service)
  );

  return (
    <View style={styles.outerContainer}>
      {!isLoading && props.busStopDetails && (
        <View>
          <View style={styles.upper}>
            <View style={styles.busStopCodeWrapper}>
              <Text style={styles.busStopCode}>{props.busStopCode}</Text>
            </View>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.description} adjustsFontSizeToFit numberOfLines={1}>
                {props.busStopDetails?.Description}
              </Text>
            </View>
          </View>
          <View style={styles.lower}>
            <View style={styles.distanceWrapper}>
              <Text style={styles.distance}>{props.busStopDetails?.Distance}m</Text>
            </View>
            <View style={styles.roadNameWrapper}>
              <Text style={styles.roadName}>{props.busStopDetails?.RoadName}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.servicesContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.onSurfaceSecondary} />
        ) : busArrivalData.length > 0 ? (
          busArrivalData.map((busService) => (
            <LikedBusesBusComponent
              key={busService.ServiceNo}
              busNumber={busService.ServiceNo}
              busStopCode={props.busStopCode}
              groupName={props.groupName}
              nextBuses={busService.nextBuses}
              isHearted={true}
              onHeartToggle={toggleLike}
            />
          ))
        ) : (
          <Text style={styles.noBusesText}>
            No liked buses are currently in operation
          </Text>
        )}
      </View>

      {/* Buses not in operation */}
      {busesNotInOperation.length > 0 && !isLoading && (
        <View style={styles.notInOperationContainer}>
          <Text style={styles.notOperationalText}>Not In Operation</Text>
          <View style={styles.notInOperationGrid}>
            {busesNotInOperation.map((busService) => (
              <View key={busService} style={styles.notInOperationBox}>
                <View style={styles.diagonalLine} />
                <Text style={styles.notInOperationText}>{busService}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    overflow: "hidden",
    padding: scale(4),
    margin: scale(5),
    borderRadius: scale(4),
    backgroundColor: colors.surface,
  },
  upper: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: scale(20),
    marginBottom: scale(2),
  },
  lower: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: scale(16.6),
    marginBottom: scale(4),
  },
  busStopCodeWrapper: {
    flex: 6.1,
  },
  descriptionWrapper: {
    flex: 19,
  },
  busStopCode: {
    fontSize: scale(11),
    lineHeight: scale(20),
    paddingLeft: scale(7),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  description: {
    fontSize: scale(13),
    lineHeight: scale(20),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  distanceWrapper: {
    flex: 6.1,
    height: scale(16.6),
    justifyContent: "center",
  },
  roadNameWrapper: {
    flex: 19,
    height: scale(16.6),
    paddingBottom: scale(2),
    justifyContent: "center",
  },
  distance: {
    fontSize: scale(10),
    paddingLeft: scale(7),
    textAlign: "left",
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary,
  },
  roadName: {
    fontSize: scale(11),
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary,
  },
  servicesContainer: {
    gap: scale(4),
  },
  noBusesText: {
    fontSize: scale(12),
    fontFamily: font.bold,
    padding: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    color: colors.warning,
    textAlign: "center",
  },
  notInOperationContainer: {
    marginTop: scale(8),
    padding: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,

    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  notOperationalText: {
    fontSize: scale(10.5),
    fontFamily: font.semiBold,
    marginBottom: scale(4),
    color: colors.onSurfaceSecondary2,
  },
  notInOperationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(6),
  },
  notInOperationBox: {
    borderRadius: scale(4),
    width: scale(33),
    height: scale(33),
    // padding: scale(8),
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Enables absolute positioning of the diagonal line
  },
  diagonalLine: {
    position: "absolute",
    width: "140%", // Ensures the line covers the box diagonally
    height: scale(1.5),
    backgroundColor: colors.warning, // Use a distinct color for the cross-out
    transform: [{ rotate: "-45deg" }],
    top: "50%",
    left: "-20%", // Adjust to align the diagonal line correctly
    opacity: 0.25,
  },
  notInOperationText: {
    fontSize: scale(11),
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary2,
    textAlign: "center",
  },
  
});

export default LikedBusesBusStopComponent;
