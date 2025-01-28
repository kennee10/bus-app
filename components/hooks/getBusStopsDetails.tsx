import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { calculateDistance } from "./usefulFunctions";

type BusStopWithDistance = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: string;
};

export const getBusStopsDetails = async (likedBusStops: string[]): Promise<BusStopWithDistance[]> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission denied");
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const storedData = await AsyncStorage.getItem("busStops");
    if (!storedData) {
      throw new Error("No bus stop data found");
    }

    const parsedData = JSON.parse(storedData);

    // Get details and calculate distance
    const enhancedStops = parsedData
      .filter((stop: BusStopWithDistance) => likedBusStops.includes(stop.BusStopCode))
      .map((stop: BusStopWithDistance) => {
        const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude).toFixed(0);
        return { ...stop, Distance: distance };
      })
      .sort(
        (a: BusStopWithDistance, b: BusStopWithDistance) =>
          likedBusStops.indexOf(a.BusStopCode) - likedBusStops.indexOf(b.BusStopCode)
      );

    return enhancedStops;
  } catch (error) {
    console.error("getBusStopsDetails.tsx: Error fetching liked bus stops: ", error);
    return [];
  }
};
