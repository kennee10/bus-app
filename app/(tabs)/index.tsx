import React, { useState, useEffect } from "react";
import { Text, FlatList, SafeAreaView, TouchableOpacity, View, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";

import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { getNearbyBusStops } from '../../components/hooks/getNearbyBusStops';
import BusStopComponent from '../../components/main/BusStopComponent';
import { useLikedBusStops } from "../../components/context/likedBusStopsContext";
import { LocationWatcher } from "../../components/hooks/LocationWatcher";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RawBusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
};

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

const NearbyBusStopsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [busStops, setBusStops] = useState<RawBusStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<BusStopWithDist[]>([]);
  const [nearbyBusStops, setNearbyBusStops] = useState<BusStopWithDist[]>([]);
  const [limit, setLimit] = useState<number>(8);
  const [loading, setLoading] = useState(true);
  const { likedBusStops, toggleLike } = useLikedBusStops();

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    (async () => {
      const result = await LocationWatcher(async (coords) => {
        try {
          const nearbyStops = await getNearbyBusStops(coords);
          setNearbyBusStops(nearbyStops);
          setLimit(Math.min(8, nearbyStops.length));
        } catch (error) {
          console.error("Error fetching nearby bus stops:", error);
        } finally {
          setLoading(false);
        }
      });

      if (result && result.subscription) {
        subscription = result.subscription;
        console.log("Subscription started:", subscription);
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
        console.log("Subscription removed");
      }
    };
  }, []);

  const increaseLimit = () => {
    setLimit((prevLimit) => Math.min(prevLimit + 8, nearbyBusStops.length));
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
            color={colors.accent}
            size={scale(23)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const fetchBusStops = async () => {
      const storedBusStops = await AsyncStorage.getItem("busStops");
      if (storedBusStops) {
        const parsedStops = JSON.parse(storedBusStops) as RawBusStop[];
        setBusStops(parsedStops);
      }
    };

    fetchBusStops();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = nearbyBusStops.filter(
      (stop) =>
        stop.BusStopCode.toLowerCase().includes(lowerCaseQuery) ||
        stop.Description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStops(filtered);
  }, [searchQuery, nearbyBusStops]);

  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a bus stop..."
          placeholderTextColor={colors.accent}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ flex: 1 }}
        />
      ) : (
        (filteredStops.length > 0 ? (
          <FlatList
            data={filteredStops.slice(0, limit)}
            keyExtractor={(item) => item.BusStopCode}
            renderItem={({ item }) => (
              <BusStopComponent
                BusStopCode={item.BusStopCode}
                Description={item.Description}
                RoadName={item.RoadName}
                Distance={item.Distance.toFixed(0)}
                isLiked={likedBusStops.includes(item.BusStopCode)}
                onLikeToggle={toggleLike}
              />
            )}
            ListFooterComponent={filteredStops.length > limit ? renderFooter : null}
          />
        ) : (
          <Text style={containerStyles.globalTextMessage}>
            No bus stops match your search
          </Text>
        ))
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    width: scale(340),
    padding: scale(4),
    marginBottom: scale(10),
    borderRadius: scale(10),
    borderWidth: scale(1.3),
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    borderColor: colors.accent,
  },
  searchIcon: {
    fontSize: scale(20),
    paddingLeft: scale(5),
    color: colors.accent,
  },
  searchInput: {
    flex: 1,
    color: colors.accent,
    fontFamily: font.bold,
    fontSize: scale(12),
    marginLeft: scale(10),
  },
});

export default NearbyBusStopsPage;
