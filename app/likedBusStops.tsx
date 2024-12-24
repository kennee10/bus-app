import React, { useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, SafeAreaView, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import * as Location from 'expo-location';

import { colors, font } from '../assets/styles/GlobalStyles';
import BusStopComponent from '../components/main/BusStopComponent';
import { calculateDistance } from '../components/getNearbyBusStops';
import { useLikedBusStops } from '../components/context/likedBusStopsContext'

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
    <View style={styles.container}>
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
        <Text style={styles.messageText}>No Liked Bus Stops</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageText: {
    fontSize: scale(14),
    fontFamily: font.bold,
    color: colors.text,
  },


  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LikedBusStopsComponent;
