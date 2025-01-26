import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, font } from "../../assets/styles/GlobalStyles";
import LikedBusesBusComponent from "./LikedBusesBusComponent";
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
  lastUpdated?: Date; // Individual lastUpdated timestamp
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};

type LikedBusesBusStopComponentProps = {
  busStopCode: string;
  groupName: string;
  likedServices: string[]; // Array of liked service numbers
};

const LikedBusesBusStopComponent: React.FC<LikedBusesBusStopComponentProps> = (props) => {
  const [busArrivalData, setBusArrivalData] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { likedBuses, toggleLike } = useLikedBuses();

  // GETTING ARRIVAL DATA
  useEffect(() => {
      let intervalId; 
      let latestBusArrivalData = busArrivalData; // Create a local reference
      
      const fetchAndSetBusArrivalData = async () => {
        try {
          const fetchedData = await fetchBusArrival(props.busStopCode, props.likedServices);
    
          const updatedData = fetchedData.map((service: BusService) => ({
            ...service,
            nextBuses: service.nextBuses.map((bus: BusArrivalInfo, index: number) => {
              // Use local reference instead of state
              const existingBusService = latestBusArrivalData.find(
                (existingService) => existingService.ServiceNo === service.ServiceNo
              );
              // compares same index nextBuses in existing and new
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
    
          latestBusArrivalData = updatedData; // Update local reference
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
    }, [likedBuses]);

  return (
    <View style={styles.container}>
      <Text style={styles.busStopTitle}>Bus Stop: {props.busStopCode}</Text>
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
            isHearted={true} // Since these are liked buses
            onHeartToggle={toggleLike} // No-op for now
          />
        ))
      ) : (
        <Text style={styles.noBusesText}>No buses are currently in operation for your liked services.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  busStopTitle: {
    fontSize: 16,
    fontFamily: font.bold,
    color: colors.onSurface,
    marginBottom: 8,
  },
  noBusesText: {
    fontSize: 14,
    fontFamily: font.bold,
    color: colors.warning,
    textAlign: "center",
  },
});

export default LikedBusesBusStopComponent;
