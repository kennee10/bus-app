import React, { useState, useEffect, useRef } from "react";
import { 
  Text, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  TextInput, 
  StyleSheet,
  Modal,
  Button
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { calculateDistance } from "../../components/hooks/usefulFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from 'react-native';
import { BackHandler } from 'react-native';

import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { getNearbyBusStops } from '../../components/hooks/getNearbyBusStops';
import BusStopComponent from '../../components/main/BusStopComponent';
import { useLikedBusStops } from "../../components/context/likedBusStopsContext";
import { LocationWatcher } from "../../components/hooks/LocationWatcher";
import InfoModalComponent from "../../components/main/InfoModalComponent";

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
  const [nearbyBusStops, setNearbyBusStops] = useState<BusStopWithDist[]>([]);
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number } | null>(null);
  const [filteredStops, setFilteredStops] = useState<BusStopWithDist[]>([]);
  const [limit, setLimit] = useState<number>(8);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { likedBusStops, toggleLike } = useLikedBusStops();


  useEffect(() => {
    const backAction = () => {
      console.log("back button")
        Keyboard.dismiss(); // Dismiss the keyboard
        // Add any other logic for handling back button press
        return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    return () => backHandler.remove();
}, []);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    (async () => {
      const result = await LocationWatcher(async (coords) => {
        setUserCoords({ latitude: coords.latitude, longitude: coords.longitude });

        try {
          const nearbyStops = await getNearbyBusStops(coords);
          setNearbyBusStops(nearbyStops);
          setLimit(Math.min(8, nearbyStops.length));

          const storedBusStops = await AsyncStorage.getItem("busStops");
          if (storedBusStops) {
            const parsedStops = JSON.parse(storedBusStops) as RawBusStop[];
            setBusStops(parsedStops);
          }
        } catch (error) {
          console.error("Error fetching nearby/all bus stops:", error);
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
    setLimit((prevLimit) => Math.min(prevLimit + 8, filteredStops.length));
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
            borderColor: colors.secondary2,
          }}
        >
          <Ionicons 
            name="add-outline"
            color={colors.secondary2}
            size={scale(23)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStops(nearbyBusStops); // Default to nearby bus stops if no query
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const matchedStops = busStops
        .filter(
          (stop) =>
            stop.BusStopCode.toLowerCase().includes(lowerCaseQuery) ||
            stop.Description.toLowerCase().includes(lowerCaseQuery) ||
            stop.RoadName.toLowerCase().includes(lowerCaseQuery)
        )
        .map((stop) => {
          const distance = userCoords
            ? calculateDistance(
                userCoords.latitude,
                userCoords.longitude,
                stop.Latitude,
                stop.Longitude
              )
            : Infinity; // if user coordinates are unavailable
        
          return {
            ...stop,
            Distance: distance,
          };
        });

      setFilteredStops(matchedStops);
    }
  }, [searchQuery, busStops, nearbyBusStops]);

  const searchIconPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const clearSearchQuery = () => {
    setSearchQuery("");
    Keyboard.dismiss()
  }


  return (
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
              ref= {inputRef}
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
                <Ionicons name="close-outline" style={styles.crossIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      
      
      {/* MODAL */}
      <InfoModalComponent 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.onBackgroundSecondary}
          style={{ flex: 1 }}
        />
      ) : (
        (filteredStops.length > 0 ? (
          // <View style={containerStyles.globalContainer}>
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
                searchQuery={searchQuery}
              />
            )}
            ListFooterComponent={
              filteredStops.length > limit ? renderFooter : null
            }
          />
          // </View>
          
        ) : (
          (nearbyBusStops.length > 0 ? (
              <View style={containerStyles.pageContainer}>
                <Text style={containerStyles.globalTextMessage}>No bus stops match your search</Text>
              </View>
            ) : (
              <View style={containerStyles.pageContainer}>
                <Text style={containerStyles.globalTextMessage}>No bus stops within 2000m</Text>
              </View>
            )
          )
        ))
      )}
      </View>
    </View>
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
    // backgroundColor: 'red'
  },
  crossIcon: {
    fontSize: scale(24),
    color: colors.secondary2,
    padding: scale(7),
    // backgroundColor: 'red'
  },
  searchInput: {
    flex: 1,
    color: colors.onSurfaceSecondary,
    fontFamily: font.bold,
    height: scale(40),
    fontSize: scale(12),
  },
  infoIcon: {
    fontSize: scale(22),
    color: colors.secondary2,
    padding: scale(7),
    // backgroundColor: 'red'
  },
});

export default NearbyBusStopsPage;
