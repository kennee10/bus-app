import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type BusStop = {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<BusStop[]>([]);

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

  const renderBusStop = ({ item }: { item: BusStop }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.busStopCode}>{item.BusStopCode}</Text>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.roadName}>{item.RoadName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by Bus Stop Code or Description"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredStops}
        keyExtractor={(item) => item.BusStopCode}
        renderItem={renderBusStop}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  itemContainer: {
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
