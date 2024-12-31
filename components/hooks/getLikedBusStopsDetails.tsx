import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

import { calculateDistance } from './usefulFunctions';
import { useLikedBusStops } from '../context/likedBusStopsContext';


type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

export const getLikedBusStopsDetails = () => {
  const [likedBusStopsDetails, setLikedBusStopsDetails] = useState<BusStop[]>([]);
  const { likedBusStops, toggleLike } = useLikedBusStops();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Location permission denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const storedData = await AsyncStorage.getItem("busStops");
        if (!storedData) throw new Error("No bus stop data found");
        const parsedData = JSON.parse(storedData);

        // getting details | calculating distance
        const enhancedStops = parsedData
        .filter((stop: BusStop) => likedBusStops.includes(stop.BusStopCode))
        .map((stop: BusStop) => {
          const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude);
          return { ...stop, Distance: distance };
        })
        .sort((a: { BusStopCode: string; }, b: { BusStopCode: string; }) => likedBusStops.indexOf(a.BusStopCode) - likedBusStops.indexOf(b.BusStopCode));

        setLikedBusStopsDetails(enhancedStops);
      } catch (error) {
        console.error("Error fetching liked bus stops:", error);
      }
    })();
  }, [likedBusStops]);

  return likedBusStopsDetails;
};
