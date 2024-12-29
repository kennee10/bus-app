import React, { useState, useEffect } from "react";
import { Text, FlatList, SafeAreaView } from 'react-native';

import { containerStyles } from '../../assets/styles/GlobalStyles';
import { getNearbyBusStops } from '../hooks/getNearbyBusStops';
import BusStopComponent from '../main/BusStopComponent';
import { useLikedBusStops } from "../context/likedBusStopsContext";
import { LocationWatcher } from "../hooks/LocationWatcher";

const NearbyBusStopsPage = () => {
  const [nearbyBusStops, setNearbyBusStops] = useState<{code: string; description: string; roadName: string; distance: number}[]>([]);
  const { likedBusStops, toggleLike } = useLikedBusStops();


  useEffect(() => {

    let subscription: { remove: any; };

    (async () => {
      const result = await LocationWatcher(async (coords) => {
        // Call getNearbyBusStops whenever coords changes
        try {
          const nearbyBusStops = await getNearbyBusStops(coords);
          const sortedNearbyBusStops = nearbyBusStops
            .map(([code, description, roadName, distance]) => ({ code, description, roadName, distance }))
            .sort((a, b) => a.distance - b.distance);
          
          setNearbyBusStops(sortedNearbyBusStops);
        } catch (error) {
          console.error("NearbyBusStopsPage.tsx: ", error);
        }
      });
    
      if (result && result.subscription) {
        subscription = result.subscription;
        console.log("NearbyBusStopsPage.tsx: Subscription started:", subscription);
      }
    })();
    
    

    return () => {
      // Cleanup: Remove the subscription on component unmount
      if (subscription) {
        subscription.remove();
        console.log("NearbyBusStopsPage.tsx: Subscription removed");
      }
    };
  }, []);


  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      {nearbyBusStops.length > 0 ? (
        <FlatList
          data={nearbyBusStops}
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
        <Text style={containerStyles.globalTextMessage}>No Bus Stops within 2000m</Text>
      )}
    </SafeAreaView>
  );
};

export default NearbyBusStopsPage;
