import React, { useEffect, useState } from "react";
import { Text, FlatList, View, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';

import { colors, containerStyles } from '../../assets/styles/GlobalStyles';
import BusStopComponent from "../../components/main/BusStopComponent"
import { useLikedBusStops } from '../../components/context/likedBusStopsContext';
import { getLikedBusStopsDetails } from '../../components/hooks/getLikedBusStopsDetails';

type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

const LikedBusStopsPage = () => {
  const [loading, setLoading] = useState(true);
  const { likedBusStops, toggleLike } = useLikedBusStops();
  const [likedBusStopsDetails, setLikedBusStopsDetails] = useState<BusStop[]>([]); // this function has access to likedBusStops too

  useEffect(() => {
    (async () => {
      try {
        const details = await getLikedBusStopsDetails(likedBusStops);
        setLikedBusStopsDetails(details);
      } catch (error) {
        console.error("LikedBusStopsPage.tsx: Failed to load liked bus stops details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [likedBusStops]);


  return (
    <View style={[containerStyles.pageContainer, {paddingTop:scale(10)}]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
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
              Distance={item.Distance.toFixed(0)}
              isLiked={likedBusStops.includes(item.BusStopCode)}
              onLikeToggle={() => toggleLike(item.BusStopCode)}
            />
          )}
        />
      ) : (
        <Text style={containerStyles.globalTextMessage}>No Liked Bus Stops</Text>
      )
    }
    </View>
  );
};

export default LikedBusStopsPage;
