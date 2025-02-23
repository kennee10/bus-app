import * as Location from "expo-location";
import { calculateDistance } from "./usefulFunctions";
import busStopsWithServices from '../../assets/busStopsWithServices.json';

type BusStopData = {
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  ServiceNos: string[];
};

type BusStopsJSON = {
  [code: string]: BusStopData;
};

type BusStopWithDistance = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: string;
};

export const getBusStopsDetails = async (likedBusStops: string[] = []): Promise<BusStopWithDistance[]> => {
  try {
    // Check if likedBusStops is valid
    if (!Array.isArray(likedBusStops) || likedBusStops.length === 0) {
      return []; // Return empty array if no liked bus stops
    }

    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission denied");
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Convert JSON object to array of bus stops with their codes
    const enhancedStops = Object.entries(busStopsWithServices)
      // Filter for liked bus stops
      .filter(([code]) => likedBusStops.includes(code))
      // Map to required format with distance
      .map(([code, data]) => ({
        BusStopCode: code,
        Description: data.Description,
        RoadName: data.RoadName,
        Latitude: data.Latitude,
        Longitude: data.Longitude,
        Distance: calculateDistance(
          latitude,
          longitude,
          data.Latitude,
          data.Longitude
        ).toFixed(0) + " km", // Add unit for clarity
      }))
      // Maintain original liked order
      .sort(
        (a, b) =>
          likedBusStops.indexOf(a.BusStopCode) - likedBusStops.indexOf(b.BusStopCode)
      );

    return enhancedStops;
  } catch (error) {
    console.error("getBusStopsDetails.tsx: Error fetching liked bus stops: ", error);
    return []; // Return empty array on error
  }
};