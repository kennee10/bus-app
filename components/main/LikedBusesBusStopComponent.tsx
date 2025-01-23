import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, font } from "../../assets/styles/GlobalStyles";
import BusComponent from "./BusComponent";
import fetchBusArrival from "../apis/fetchBusArrival";

type LikedBusesBusStopComponentProps = {
  busStopCode: string;
  likedBuses: string[]; // Array of liked service numbers
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
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};

const LikedBusesBusStopComponent: React.FC<LikedBusesBusStopComponentProps> = ({
  busStopCode,
  likedBuses,
}) => {
  const [busArrivalData, setBusArrivalData] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // GETTING ARRIVAL DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBusArrival(busStopCode, likedBuses); // Fetch only liked buses
        setBusArrivalData(data);
      } catch (error) {
        console.error("Error fetching bus arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // Fetch data immediately when the component mounts
    fetchData();
    // Set up the interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [busStopCode, likedBuses]);

  return (
    <View style={styles.container}>
      <Text style={styles.busStopTitle}>Bus Stop: {busStopCode}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.onSurfaceSecondary} />
      ) : busArrivalData.length > 0 ? (
        busArrivalData.map((busService) => (
          <BusComponent
            key={busService.ServiceNo}
            busNumber={busService.ServiceNo}
            busStopCode={busStopCode}
            nextBuses={busService.nextBuses}
            isHearted={true} // Since these are liked buses
            onHeartToggle={() => {}} // No-op for now
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
