import React from "react";
import { Text, FlatList, View } from 'react-native';
import { scale } from 'react-native-size-matters';

import { containerStyles } from '../../assets/styles/GlobalStyles';
import BusStopComponent from '../main/BusStopComponent';
import { useLikedBusStops } from '../context/likedBusStopsContext';
import { getLikedBusStopsDetails } from '../hooks/getLikedBusStopsDetails';

const LikedBusStopsPage = () => {
  const { likedBusStops, toggleLike } = useLikedBusStops();
  const likedBusStopsDetails = getLikedBusStopsDetails(); // this function has access to likedBusStops too

  return (
    <View style={[containerStyles.pageContainer, {paddingTop:scale(10)}]}>
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

export default LikedBusStopsPage;