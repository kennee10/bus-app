import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { scale } from "react-native-size-matters";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import BusStopComponent from "@/components/main/BusStopComponent";
import { useLikedBusStops } from '../../components/context/likedBusStopsContext';


type BusStop = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<BusStop[]>([]);
  const { likedBusStops, toggleLike } = useLikedBusStops();
  const inputRef = useRef<TextInput>(null);

  // Auto-focus the TextInput every time the page is focused
  useFocusEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 20); // Small delay ensures the input is focused after navigation settles

    return () => {
      clearTimeout(focusTimeout); // Clean up timeout on page blur
    };
  });

  useEffect(() => {
    const fetchBusStops = async () => {
      const storedBusStops = await AsyncStorage.getItem("busStops");
      if (storedBusStops) {
        const parsedStops = JSON.parse(storedBusStops) as BusStop[];
        setBusStops(parsedStops);
        setFilteredStops(parsedStops); // Default to showing all stops
      }
    };

    fetchBusStops();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = busStops.filter(
      (stop) =>
        stop.BusStopCode.toLowerCase().includes(lowerCaseQuery) ||
        stop.Description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStops(filtered);
  }, [searchQuery, busStops]);

  // const renderBusStop = ({ item }: { item: BusStop }) => (
  //   <TouchableOpacity style={styles.itemContainer}>
  //     <Text style={styles.busStopCode}>{item.BusStopCode}</Text>
  //     <Text style={styles.description}>{item.Description}</Text>
  //     <Text style={styles.roadName}>{item.RoadName}</Text>
  //   </TouchableOpacity>
  // );

  return (
    <View style={containerStyles.pageContainer}>
      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={1} // Prevents "TouchableOpacity" feedback
      >
        <Ionicons name={"search"} style={styles.searchIcon}/>
        
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search for a bus stop..."
          placeholderTextColor={colors.accent}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </TouchableOpacity>
      
      <FlatList
        data={filteredStops}
        keyExtractor={(item) => item.BusStopCode}
        renderItem={({ item }) => (
          <BusStopComponent
            BusStopCode={item.BusStopCode}
            Description={item.Description}
            RoadName={item.RoadName}
            Distance={'0'}
            isLiked={likedBusStops.includes(item.BusStopCode)}
            onLikeToggle={() => toggleLike(item.BusStopCode)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: scale(4),
    marginBottom: scale(10),
    borderRadius: scale(10),
    borderWidth: scale(1.3),
    alignItems: 'center',
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
  itemContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  busStopCode: {
    fontWeight: "bold",
  },
  description: {
    color: "#555",
  },
  roadName: {
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default SearchPage;
