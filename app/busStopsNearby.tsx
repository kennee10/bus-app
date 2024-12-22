import React, { useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import colors from '../assets/styles/Colors';
import getNearbyBusStops from '../components/getNearbyBusStops';
import BusStopComponent from '../components/main/BusStopComponent';

const BusStopsNearby = () => {
  const [busStops, setBusStops] = useState<{code: string; description: string; roadName: string; distance: number}[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const nearbyBusStops = await getNearbyBusStops();

        // Map the list into the desired format and sort by distance
        const sortedStops = nearbyBusStops
          .map(([code, description, roadName, distance]) => ({
            code,
            description,
            roadName,
            distance,
          }))
          .sort((a, b) => a.distance - b.distance);

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
              Distance={item.distance.toFixed(0)}
              Description={item.description}
              RoadName={item.roadName}
            />
          )}
        />
      ) : (
        <Text style={styles.messageText}>No nearby bus stops found.</Text>
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
});

export default BusStopsNearby;
