import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';

import { calculateDistance } from './usefulFunctions';

type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
};

type Coordinates = {
  latitude: number;
  longitude: number;
}

export const getNearbyBusStops = async (coords: Coordinates): Promise<[string, string, string, number][]> => {
  try {

    // Retrieve bus stops from local storage
    const storedData = await AsyncStorage.getItem('busStops');
    if (!storedData) {
      throw new Error('No bus stop data found locally.');
    }


    const busStops: BusStop[] = JSON.parse(storedData);
    // Create a list of nearby bus stops with their details
    const nearbyStops: [string, string, string, number][] = 
      busStops.map((busStop) => {
        const distance = calculateDistance(coords.latitude, coords.longitude, busStop.Latitude, busStop.Longitude);
        if (distance <= 2000) {
          return [busStop.BusStopCode, busStop.Description, busStop.RoadName, distance];
        }
        return null;
      })
      .filter((stop) => stop !== null) as [string, string, string, number][]; // Filter out null values

    return nearbyStops;
  } catch (error) {
    console.error('Error getting nearby bus stops:', error);
    throw error; // Re-throw the error to indicate failure
  }
};
