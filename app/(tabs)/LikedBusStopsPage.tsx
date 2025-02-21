import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { scale } from "react-native-size-matters";
import { colors, containerStyles } from "../../assets/styles/GlobalStyles";
import LikedBusStopsBusStopComponent from "../../components/main/LikedBusStopsBusStopComponent";
import { useLikedBusStops } from "../../components/context/likedBusStopsContext";
import { getBusStopsDetails } from "../../components/hooks/getBusStopsDetails";
import busStopsWithServices from "../../assets/busStopsWithServices.json";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  [busStopCode: string]: {
    Description: string;
    RoadName: string;
    Latitude: number;
    Longitude: number;
    ServiceNos: string[];
  };
};

const LIKED_BUS_STOPS_ORDER_KEY = "likedBusStopsOrder";

const LikedBusStopsPage = () => {
  const [loading, setLoading] = useState(true);
  const [likedBusStopsDetails, setLikedBusStopsDetails] = useState<BusStopWithDist[]>([]);
  const { likedBusStops, toggleLike } = useLikedBusStops();
  const [busStopsData, setBusStopsData] = useState<BusStopsData>(busStopsWithServices);

  // Load saved order from AsyncStorage on app start
  useEffect(() => {
    const loadSavedOrder = async () => {
      try {
        const savedOrder = await AsyncStorage.getItem(LIKED_BUS_STOPS_ORDER_KEY);
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          setLikedBusStopsDetails(parsedOrder);
        } else {
          // If no saved order, fetch details for liked bus stops
          const details = await getBusStopsDetails(likedBusStops);
          setLikedBusStopsDetails(details);
        }
      } catch (error) {
        console.error("Failed to load saved order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedOrder();
  }, []);

  // Save order to AsyncStorage when the list is reordered
  const onDragEnd = async ({ data }: { data: BusStopWithDist[] }) => {
    try {
      // Create a copy of the data to avoid modifying the shared object
      const updatedData = [...data];
      await AsyncStorage.setItem(LIKED_BUS_STOPS_ORDER_KEY, JSON.stringify(updatedData));
      setLikedBusStopsDetails(updatedData);
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={containerStyles.pageContainer}>
        <View style={[containerStyles.innerPageContainer, { marginTop: scale(10) }]}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.onBackgroundSecondary}
              style={{ flex: 1 }}
            />
          ) : likedBusStopsDetails.length > 0 ? (
            <DraggableFlatList
              data={likedBusStopsDetails}
              keyExtractor={(item) => item.BusStopCode}
              renderItem={({ item, drag, isActive }) => (
                <LikedBusStopsBusStopComponent
                  BusStopCode={item.BusStopCode}
                  Description={item.Description}
                  RoadName={item.RoadName}
                  Distance={item.Distance}
                  isLiked={likedBusStops.includes(item.BusStopCode)}
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
  );
};

export default LikedBusStopsPage;