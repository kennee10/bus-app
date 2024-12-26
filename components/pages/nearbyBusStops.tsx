import React, { useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { GetNearbyBusStops } from '../getNearbyBusStops';
import BusStopComponent from '../main/BusStopComponent';
import { useLikedBusStops } from "../context/likedBusStopsContext";

const NearbyBusStops = () => {
  const [busStops, setBusStops] = useState<{code: string; description: string; roadName: string; distance: number}[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { likedBusStops, toggleLike } = useLikedBusStops();

  useEffect(() => {
    (async () => {
      try {
        const nearbyBusStops = await GetNearbyBusStops();
        const sortedStops = nearbyBusStops.map(([code, description, roadName, distance]) => ({code,description,roadName,distance,})).sort((a, b) => a.distance - b.distance);
        setBusStops(sortedStops);
      
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to get nearby bus stops:', error.message);
          setErrorMsg(error.message);
        }
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <SafeAreaView style={containerStyles.globalContainer}>
        <Text style={containerStyles.globalErrorText}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      {busStops.length > 0 ? (
        <FlatList
          data={busStops}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <BusStopComponent
              BusStopCode={item.code}
              Description={item.description}
              RoadName={item.roadName}
              Distance={item.distance.toFixed(0)}
              isLiked={likedBusStops.includes(item.code)}
              onLikeToggle={toggleLike}
            />
          )}
        />
      ) : (
        <Text style={containerStyles.globalTextMessage}>No Nearby Bus Stops</Text>
      )}
    </SafeAreaView>
  );
};

export default NearbyBusStops;
