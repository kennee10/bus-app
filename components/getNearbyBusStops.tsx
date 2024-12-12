import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// returns a dictionary of Bus Stop codes and the distance from user
// BusStopsNearbyList = {'62041': ['Opp bethany ch', 'Upper paya lebar', 130] }

// Type definition for a bus stop
type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
};

// Haversine formula to calculate the distance between two coordinates in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const GetNearbyBusStops = async (): Promise<{ [key: string]: [string, string, number] }> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied.');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Retrieve bus stops from local storage
    const storedData = await AsyncStorage.getItem('busStops');
    if (!storedData) {
      throw new Error('No bus stop data found locally.');
    }

    const busStops: BusStop[] = JSON.parse(storedData);

    // Create a dictionary of nearby bus stops and their distances
    const nearbyStops = busStops.reduce<{ [key: string]: [string, string, number] }>((acc, stop) => {
      const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude);
      if (distance <= 400) {
        acc[stop.BusStopCode] = [stop.Description, stop.RoadName, distance]; // Add bus stop code and distance to dictionary
      }
      return acc;
    }, {});

    return nearbyStops;
  } catch (error) {
    console.error('Error getting nearby bus stops:', error);
    throw error; // Re-throw the error to indicate failure
  }
};

export default GetNearbyBusStops;
