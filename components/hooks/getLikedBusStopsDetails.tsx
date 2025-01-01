import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { calculateDistance } from "./usefulFunctions";

type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

export const getLikedBusStopsDetails = async (likedBusStops: string[]): Promise<BusStop[]> => {
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
      .filter((stop: BusStop) => likedBusStops.includes(stop.BusStopCode))
      .map((stop: BusStop) => {
        const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude);
        return { ...stop, Distance: distance };
      })
      .sort(
        (a: BusStop, b: BusStop) =>
          likedBusStops.indexOf(a.BusStopCode) - likedBusStops.indexOf(b.BusStopCode)
      );

    return enhancedStops;
  } catch (error) {
    console.error("getLikedBusStopsDetails.tsx: Error fetching liked bus stops: ", error);
    return [];
  }
};
