import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  Text,
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  TextInput, 
  StyleSheet,
  Keyboard,
  BackHandler,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { calculateDistance } from "../../components/hooks/usefulFunctions";
import { colors, containerStyles, font, navigationBarHeight } from '../../assets/styles/GlobalStyles';
import BusStopComponent from '../../components/main/BusStopComponent';
import { useLikedBusStops } from "../../components/context/likedBusStopsContext";
import { LocationWatcher } from "../../components/hooks/LocationWatcher";
import InfoModal from "../../components/main/InfoModal";
import busStopsWithServices from '../../assets/busStopsWithServices.json';
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";

type BusStopData = {
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  ServiceNos: string[];
}

type BusStopWithDist = BusStopData & {
  BusStopCode: string;
  Distance: number;
}

const NearbyBusStopsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyBusStops, setNearbyBusStops] = useState<BusStopWithDist[]>([]);
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { likedBusStopsOrder, toggleLike } = useLikedBusStops();

  // Memoized bus stops data
  const allBusStops = useMemo(() => 
    Object.entries(busStopsWithServices).map(([code, data]) => ({
      BusStopCode: code,
      ...data,
      Distance: userCoords
        ? calculateDistance(
            userCoords.latitude,
            userCoords.longitude,
            data.Latitude,
            data.Longitude
          )
        : Infinity
    })), 
  [userCoords]);

  // Filtered and sorted stops
  const filteredStops = useMemo(() => {
    if (searchQuery.trim() === "") {
      return nearbyBusStops;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return allBusStops
      .filter(stop => {
        const lowerDescription = stop.Description.toLowerCase();
        const lowerCode = stop.BusStopCode.toLowerCase();
        const lowerRoad = stop.RoadName.toLowerCase();
        return (
          lowerDescription.includes(lowerCaseQuery) ||
          lowerCode.includes(lowerCaseQuery) ||
          lowerRoad.includes(lowerCaseQuery)
        );
      })
      .sort((a, b) => {
        const getPriority = (stop: BusStopWithDist) => {
          const lowerDesc = stop.Description.toLowerCase();
          const lowerCode = stop.BusStopCode.toLowerCase();
          const lowerRoad = stop.RoadName.toLowerCase();
          
          if (lowerDesc.includes(lowerCaseQuery)) return 3;
          if (lowerCode.includes(lowerCaseQuery)) return 2;
          if (lowerRoad.includes(lowerCaseQuery)) return 1;
          return 0;
        };

        const aPriority = getPriority(a);
        const bPriority = getPriority(b);
        
        return bPriority - aPriority || a.Distance - b.Distance;
      });
  }, [searchQuery, nearbyBusStops, allBusStops]);

  // Pagination
  const [limit, setLimit] = useState<number>(12);
  const handleEndReached = useCallback(() => {
    if (filteredStops.length > limit) {
      setLimit(prev => Math.min(prev + 8, filteredStops.length));
    }
  }, [filteredStops.length, limit]);

  // Back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Keyboard.dismiss();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  // Location watcher with throttling
  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | null = null;

    const processLocation = async (coords: { latitude: number; longitude: number }) => {
      if (!isMounted) return;

      try {
        const busStopsArray = allBusStops.map(stop => ({
          ...stop,
          Distance: calculateDistance(
            coords.latitude,
            coords.longitude,
            stop.Latitude,
            stop.Longitude
          )
        }));

        const nearbyStops = busStopsArray
          .filter(stop => stop.Distance <= 2000)
          .sort((a, b) => a.Distance - b.Distance);

        if (isMounted) {
          setUserCoords(coords);
          setNearbyBusStops(nearbyStops);
          setLimit(prev => Math.min(prev, nearbyStops.length));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error processing bus stops data:", error);
      }
    };

    (async () => {
      const result = await LocationWatcher(async (coords) => {
        // Throttle location updates to 1 second
        if (isMounted) {
          processLocation(coords);
        }
      }); // Throttle to 1 second

      if (result?.subscription) {
        subscription = result.subscription;
      }
    })();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  // Search input handlers
  const searchIconPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
    Keyboard.dismiss();
  }, []);

  // Memoized FlatList render item
  const renderItem = useCallback(({ item }: { item: BusStopWithDist }) => (
    <BusStopComponent
      key={item.BusStopCode}
      BusStopCode={item.BusStopCode}
      Description={item.Description}
      RoadName={item.RoadName}
      Distance={item.Distance.toFixed(0)}
      isLiked={likedBusStopsOrder.includes(item.BusStopCode)}
      onLikeToggle={toggleLike}
      searchQuery={searchQuery}
      allBusServices={item.ServiceNos}
    />
  ), [likedBusStopsOrder, searchQuery, toggleLike]);

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={containerStyles.pageContainer}>
        <View style={containerStyles.innerPageContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.searchContainer}>
              {searchQuery === "" ? (
                <TouchableOpacity onPress={searchIconPress} activeOpacity={1}>
                  <Ionicons name="search" style={styles.searchIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={clearSearchQuery}>
                  <Ionicons name="arrow-back" style={styles.searchIcon} />
                </TouchableOpacity>
              )}

              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search for a bus stop..."
                placeholderTextColor={colors.onSurfaceSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchQuery === "" ? (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <Ionicons name="information-circle-outline" style={styles.infoIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={clearSearchQuery}>
                  <Ionicons name="close-circle" style={styles.crossIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.onBackgroundSecondary}
              style={{ flex: 1 }}
            />
          ) : (
            filteredStops.length > 0 ? (
              <DraggableFlatList
                data={filteredStops.slice(0, limit)}
                keyExtractor={(item) => item.BusStopCode}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: navigationBarHeight + scale(10)}}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                removeClippedSubviews
                initialNumToRender={12}
                maxToRenderPerBatch={8}
                windowSize={12}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.000001}
              />
                
            ) : (
              nearbyBusStops.length > 0 ? (
                <View style={containerStyles.pageContainer}>
                  <Text style={containerStyles.globalInfoTextMessage}>No bus stops match your search</Text>
                </View>
              ) : (
                <View style={containerStyles.pageContainer}>
                  <Text style={containerStyles.globalInfoTextMessage}>No bus stops within 2000m</Text>
                </View>
              )
            )
          )}
        </View>
      </View>
      <InfoModal 
            isVisible={isModalVisible} 
            onClose={() => setIsModalVisible(false)}
          />
      </GestureHandlerRootView>

      
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    overflow: "hidden",
    marginTop: scale(5),
    marginBottom: scale(10),
    borderRadius: scale(10),
    borderWidth: scale(1.3),
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.onBackgroundSecondary,
  },
  searchIcon: {
    fontSize: scale(18),
    padding: scale(10),
    color: colors.secondary2,
    opacity: 0.8,
  },
  crossIcon: {
    fontSize: scale(24),
    color: colors.secondary2,
    padding: scale(7),
  },
  searchInput: {
    flex: 1,
    color: colors.onSurfaceSecondary,
    fontFamily: font.semiBold,
    height: scale(40),
    fontSize: scale(12),
  },
  infoIcon: {
    fontSize: scale(22),
    color: colors.secondary2,
    padding: scale(7),
    opacity: 0.8,
  },
});

export default NearbyBusStopsPage;