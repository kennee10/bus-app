import React, { useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import colors from '../assets/styles/Colors';
import { GetNearbyBusStops } from '../components/getNearbyBusStops';
import BusStopComponent from '../components/main/BusStopComponent';

import { useLikedBusStops } from "../components/context";

const BusStopsNearby = () => {
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
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.messageText}>No Nearby Bus Stops</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  messageText: {
    fontSize: scale(14),
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BusStopsNearby;
