import React, { useState, useEffect } from "react";
import { Text, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";

import { containerStyles } from '../../assets/styles/GlobalStyles';
import { getNearbyBusStops } from '../hooks/getNearbyBusStops';
import BusStopComponent from '../main/BusStopComponent';
import { useLikedBusStops } from "../context/likedBusStopsContext";
import { LocationWatcher } from "../hooks/LocationWatcher";
import GlobalStyles from "@/styles/GlobalStyles";



const NearbyBusStopsPage = () => {
  const [nearbyBusStops, setNearbyBusStops] = useState<{code: string; description: string; roadName: string; distance: number}[]>([]);
  const [limit, setLimit] = useState<number | undefined>();
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
          setLimit(Math.min(8, nearbyBusStops.length));

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

  const increaseLimit = () => {
    setLimit((prevLimit) => {
      const newLimit = Math.min((prevLimit ?? 0) + 5, nearbyBusStops.length);
      return newLimit;
    });
  };

  const renderFooter = () => {
    return (
      <View style={containerStyles.iconContainer}>
        <TouchableOpacity
          onPress={increaseLimit}
          style={{
            borderRadius: scale(30),
            borderWidth: scale(1.5),
            borderColor: 'gray',
          }}
        >
          <Ionicons 
            name="add-outline"
            color="gray"
            size={scale(25)}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      {nearbyBusStops.length > 0 ? (
        <View>
            <FlatList
              data={nearbyBusStops.slice(0, limit)}
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
              ListFooterComponent={renderFooter}
            />
        </View>
        
      ) : (
        <Text style={containerStyles.globalTextMessage}>No Bus Stops within 2000m</Text>
      )}
    </SafeAreaView>
  );
};

export default NearbyBusStopsPage;
