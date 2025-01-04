import AsyncStorage from '@react-native-async-storage/async-storage';

import { calculateDistance } from './usefulFunctions';

type RawBusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
};

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

type UserCoordinates = {
  latitude: number;
  longitude: number;
}

export const getNearbyBusStops = async (UserCoords: UserCoordinates): Promise<BusStopWithDist[]> => {
  try {
    // Retrieve bus stops from local storage
    const storedAllStops = await AsyncStorage.getItem('allBusStops');
    if (!storedAllStops) {
      throw new Error('No bus stop data found locally.');
    }

    const allBusStops: RawBusStop[] = JSON.parse(storedAllStops);

    // Create a list of nearby bus stops with their details
    const nearbyBusStops: BusStopWithDist[] =
      allBusStops.map((busStop) => {
        const distance = calculateDistance(
          UserCoords.latitude,
          UserCoords.longitude,
          busStop.Latitude,
          busStop.Longitude
        );
        if (distance <= 2000) {
          return {
            BusStopCode: busStop.BusStopCode,
            Description: busStop.Description,
            RoadName: busStop.RoadName,
            Latitude: busStop.Latitude,
            Longitude: busStop.Longitude,
            Distance: distance,
          };
        }
        return null;
      })
      .filter((busStop): busStop is BusStopWithDist => busStop !== null) // Type guard to filter out null values
      .sort((a, b) => a.Distance - b.Distance); // Sort by distance

    return nearbyBusStops;
  } catch (error) {
    console.error('getNearbyBusStops.tsx: Error getting nearby bus stops: ', error);
    throw error; // Re-throw the error to indicate failure
  }
};
