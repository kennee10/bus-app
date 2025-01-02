import React, { useState, useEffect } from "react";
import { Text, FlatList, SafeAreaView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";

import { colors, containerStyles } from '../../assets/styles/GlobalStyles';
import { getNearbyBusStops } from '../../components/hooks/getNearbyBusStops';
import BusStopComponent from '../../components/main/BusStopComponent';
import { useLikedBusStops } from "../../components/context/likedBusStopsContext";
import { LocationWatcher } from "../../components/hooks/LocationWatcher";
import SearchComponent from "../../components/main/SearchComponent";


const NearbyBusStopsPage = () => {
  const [nearbyBusStops, setNearbyBusStops] = useState<{code: string; description: string; roadName: string; distance: number}[]>([]);
  const [limit, setLimit] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
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
        } finally {
          setLoading(false);
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
      const newLimit = Math.min((prevLimit ?? 0) + 8, nearbyBusStops.length);
      return newLimit;
    });
  };

  const renderFooter = () => {
    return (
      <View style={containerStyles.iconContainer}>
        <TouchableOpacity
          onPress={increaseLimit}
          style={{
            borderRadius: scale(12),
            borderWidth: scale(1.3),
            padding: scale(3),
            borderColor: colors.accent,
          }}
        >
          <Ionicons 
            name="add-outline"
            color= {colors.accent}
            size={scale(23)}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[containerStyles.pageContainer]}>
      
      <SearchComponent />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{flex:1}}
        />
      ) : (nearbyBusStops.length > 0 ? (
        <View style={{flex: 1}}>
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
      ))
    }
    </SafeAreaView>
  );
};

export default NearbyBusStopsPage;
