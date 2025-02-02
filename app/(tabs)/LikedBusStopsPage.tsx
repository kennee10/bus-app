import React, { useEffect, useState } from "react";
import { Text, FlatList, View, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';

import { colors, containerStyles } from '../../assets/styles/GlobalStyles';
import BusStopComponent from "../../components/main/BusStopComponent"
import { useLikedBusStops } from '../../components/context/likedBusStopsContext';
import { getBusStopsDetails } from '../../components/hooks/getBusStopsDetails';
import AsyncStorage from "@react-native-async-storage/async-storage";

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: string;
};

type BusStopsData = {
  [busStopCode: string]: string[]; // Changed from Set<string> to string[]
};

const LikedBusStopsPage = () => {
  const [loading, setLoading] = useState(true);
  const [likedBusStopsDetails, setLikedBusStopsDetails] = useState<BusStopWithDist[]>([]); // this function has access to likedBusStops too
  const { likedBusStops, toggleLike } = useLikedBusStops();
  const [busStopsData, setBusStopsData] = useState<BusStopsData>({});

  useEffect(() => {
    (async () => {
      try {
        // console.log('LikedBusStopsPage.tsx: getting liked bus stops')
        const details = await getBusStopsDetails(likedBusStops);
        setLikedBusStopsDetails(details);

        // Fetch busStopsData from AsyncStorage
        const storedBusStopsData = await AsyncStorage.getItem("busStopsData");
        if (storedBusStopsData) {
          const parsedBusStopsData = JSON.parse(storedBusStopsData) as BusStopsData;
          // Remove Set-related logging since we're using arrays now
          setBusStopsData(parsedBusStopsData);
        }
      } catch (error) {
        console.error("LikedBusStopsPage.tsx: Failed to load liked bus stops details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [likedBusStops]);


  return (
    <View style={containerStyles.pageContainer}>
      <View style={[containerStyles.innerPageContainer, {marginTop: scale(10)}]}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.onBackgroundSecondary}
            style={{flex:1}}
          />
        ) : likedBusStopsDetails.length > 0 ? (
          <FlatList
            data={likedBusStopsDetails}
            keyExtractor={(item) => item.BusStopCode}
            renderItem={({ item }) => (
              <BusStopComponent
                BusStopCode={item.BusStopCode}
                Description={item.Description}
                RoadName={item.RoadName}
                Distance={item.Distance}
                isLiked={likedBusStops.includes(item.BusStopCode)}
                onLikeToggle={() => toggleLike(item.BusStopCode)}
                searchQuery=""
                allBusServices={busStopsData[item.BusStopCode] || []} // No 
              />
            )}
          />
        ) : (
          <View style={containerStyles.pageContainer}>
            <Text style={containerStyles.globalTextMessage}>No liked bus stops</Text>
          </View>
          
        )
      }
      </View>
    </View>
  );
};

export default LikedBusStopsPage;
