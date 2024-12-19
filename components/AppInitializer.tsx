import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import fetchBusStops from "./fetchBusStops";
import * as Font from 'expo-font';

interface AppInitializerProps {
  onFetchComplete: () => void;
  onError: (error: string) => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onFetchComplete, onError }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [isFontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("AppInitializer: Starting initialization...");
        await fetchBusStops();
        console.log("AppInitializer: Bus stops fetched successfully.");
        setIsFetching(false);
        onFetchComplete(); // Notify parent about success
      } catch (error) {
        console.error("AppInitializer: Error fetching bus stops", error);
        setIsFetching(false);
        onError(error instanceof Error ? error.message : "Unknown error occurred");
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'Nunito-Bold': require('../assets/fonts/Nunito/Nunito-Bold.ttf')
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);

  if (isFetching && !isFontsLoaded) {
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
