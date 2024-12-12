import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useFetchBusStops from "./fetchBusStops";

interface AppInitializerProps {
  onFetchComplete: () => void;
  onError: (error: string) => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onFetchComplete, onError }) => {
  const [isFetching, setIsFetching] = useState(true);

  useFetchBusStops(
    () => {
      console.log("AppInitializer.tsx: fetching bus stops")
      setIsFetching(false);
      onFetchComplete(); // Notify parent component on success
    }
  );

  if (isFetching) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching bus stop data...</Text>
      </View>
    );
  }

  return null; // Render nothing once fetching is complete
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
});

export default AppInitializer;
