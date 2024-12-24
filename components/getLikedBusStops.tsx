import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { calculateDistance } from '../components/getNearbyBusStops';

type BusStop = {
    BusStopCode: string,
    Description: string,
    RoadName: string,
    Latitude: number,
    Longitude: number
};

const GetLikedBusStops = async(): Promise<[string, string, string, number][]> => {
    try {

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const storedLikedStops = await AsyncStorage.getItem("likedBusStops");
        const parsedLikedStops = storedLikedStops ? JSON.parse(storedLikedStops) : [];

        // get all bus stop
        const storedBusStops = await AsyncStorage.getItem('busStops');
        if (!storedBusStops) {
            throw new Error('No bus stops found in async storage')
        }
        const parsedBusStops: BusStop[] = JSON.parse(storedBusStops);

        // create bus stop lookup map
        const busStopMap: Record<string, BusStop> = parsedBusStops.reduce((map, stop) => {
            map[stop.BusStopCode] = stop;
            return map;
        }, {} as Record<string, BusStop>);

        // get liked bus stop details
        const likedBusStopDetails = parsedLikedStops.map((code: string | number) => busStopMap[code]).filter(Boolean);

        // calc dist of liked bus stops from user
        const likedBusStops: [string, string, string, number][] =
        likedBusStopDetails.map((stop: BusStop) => {
            const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude);
            return [stop.BusStopCode, stop.Description, stop.RoadName, distance];
        })
        
        return likedBusStops;
    } catch {
        console.log('error')
        return [];
    }
};

export default GetLikedBusStops;