import React, { useState, useEffect } from "react";
import { Text, FlatList, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

import { containerStyles } from '../../assets/styles/GlobalStyles';
import BusStopComponent from '../main/BusStopComponent';
import { calculateDistance } from '../getNearbyBusStops';
import { useLikedBusStops } from '../context/likedBusStopsContext'

type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};


const LikedBusStopsComponent = () => {
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
        const enhancedStops = parsedData
          .filter((stop: BusStop) => likedBusStops.includes(stop.BusStopCode)) // Filter liked stops
          .map((stop: BusStop) => {
            const distance = calculateDistance(latitude, longitude, stop.Latitude, stop.Longitude);
            return { ...stop, Distance: distance };
          });

        setLikedBusStopsDetails(enhancedStops);
      } catch (error) {
        console.error("Error fetching liked bus stops:", error);
      }
    })();
  }, [likedBusStops]);


  return (
    <View style={containerStyles.pageContainer}>
      {likedBusStopsDetails.length > 0 ? (
        <FlatList
          data={likedBusStopsDetails}
          keyExtractor={(item) => item.BusStopCode}
          renderItem={({ item }) => (
            <BusStopComponent
              BusStopCode={item.BusStopCode}
              Description={item.Description}
              RoadName={item.RoadName}
              Distance={item.Distance.toFixed(0)}
              isLiked={likedBusStops.includes(item.BusStopCode)}
              onLikeToggle={() => toggleLike(item.BusStopCode)}
            />
          )}
        />
      ) : (
        <Text style={containerStyles.globalTextMessage}>No Liked Bus Stops</Text>
      )}
    </View>
  );
};

export default LikedBusStopsComponent;
