import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import { colors, containerStyles, navigationBarHeight } from '../../assets/styles/GlobalStyles';
import LikedBusStopsBusStopComponent from '../../components/main/LikedBusStopsBusStopComponent';
import { useLikedBusStops } from '../../components/context/likedBusStopsContext';
import { getBusStopsDetails } from '../../components/hooks/getBusStopsDetails';
import busStopsWithServices from '../../assets/busStopsWithServices.json';
import FlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from 'react-native-draggable-flatlist';

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: string;
};

type BusStopsData = {
  [busStopCode: string]: {
    Description: string;
    RoadName: string;
    Latitude: number;
    Longitude: number;
    ServiceNos: string[];
  };
};

const LikedBusStopsPage = () => {
  const [loading, setLoading] = useState(true);
  const [likedBusStopsDetails, setLikedBusStopsDetails] = useState<BusStopWithDist[]>([]);
  const { likedBusStopsOrder, toggleLike, updateLikedBusStopsOrder } = useLikedBusStops();
  const [busStopsData, setBusStopsData] = useState<BusStopsData>(busStopsWithServices);

  // Load details based on order
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const details = await getBusStopsDetails(likedBusStopsOrder);
        setLikedBusStopsDetails(details);
      } catch (error) {
        console.error('Failed to load bus stop details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [likedBusStopsOrder]);

  // Handle drag reorder
  const onDragEnd = async ({ data }: { data: BusStopWithDist[] }) => {
    const newOrder = data.map((item) => item.BusStopCode);
    await updateLikedBusStopsOrder(newOrder);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={containerStyles.pageContainer}>
          <View style={[containerStyles.innerPageContainer, { marginTop: scale(10) }]}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.onBackgroundSecondary} style={{ flex: 1 }} />
            ) : likedBusStopsDetails.length > 0 ? (
              <DraggableFlatList
                data={likedBusStopsDetails}
                keyExtractor={(item) => item.BusStopCode}
                keyboardShouldPersistTaps="always"
                renderItem={({ item, drag, isActive }) => (
                  <LikedBusStopsBusStopComponent
                    BusStopCode={item.BusStopCode}
                    Description={item.Description}
                    RoadName={item.RoadName}
                    Distance={item.Distance}
                    isLiked={likedBusStopsOrder.includes(item.BusStopCode)} // Check if in order array
                    onLikeToggle={() => toggleLike(item.BusStopCode)}
                    searchQuery=""
                    allBusServices={busStopsData[item.BusStopCode]?.ServiceNos || []}
                    onLongPress={drag}
                    isActive={isActive}
                  />
                )}
                onDragEnd={onDragEnd}
              />
            ) : (
              <View style={containerStyles.pageContainer}>
                <Text style={containerStyles.globalInfoTextMessage}>
                  You haven't liked any bus stops
                </Text>
              </View>
            )}
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
    
  );
};

export default LikedBusStopsPage;