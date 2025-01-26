import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import fetchAllBusStops from "../components/apis/fetchAllBusStops";

interface AppInitializerProps {
  onInitializationComplete: () => void; // Called when both fetching and font loading are complete
  onError: (error: string) => void; // Called when an error occurs
}

const AppInitializer: React.FC<AppInitializerProps> = ({
  onInitializationComplete,
  onError,
}) => {
  const [isFetchingComplete, setFetchingComplete] = useState(false);
  const [isFontLoadingComplete, setFontLoadingComplete] = useState(false);

  // Fetch all bus stops
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        await fetchAllBusStops();
        setFetchingComplete(true); // Fetching complete
      } catch (error) {
        onError(error instanceof Error ? error.message : "Unknown error occurred during fetching");
      }
    };

    fetchBusStops();
  }, []);

  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
          "Nunito-Medium": require("../assets/fonts/Nunito/Nunito-Medium.ttf"),
          "Nunito-SemiBold": require("../assets/fonts/Nunito/Nunito-SemiBold.ttf"),
          "Nunito-Bold": require("../assets/fonts/Nunito/Nunito-Bold.ttf"),
        });
        setFontLoadingComplete(true); // Fonts loaded successfully
      } catch (error) {
        onError("Error loading fonts");
      }
    };

    loadFonts();
  }, []);

  // Check if both tasks are complete
  useEffect(() => {
    if (isFetchingComplete && isFontLoadingComplete) {
      onInitializationComplete(); // Notify parent that initialization is complete
    }
  }, [isFetchingComplete, isFontLoadingComplete]);

  // CLEAR LIKED BUSES DATA
  const clearLikedBusesData = async () => {
    try {
      // Remove the old data for 'likedBuses'
      await AsyncStorage.removeItem('likedBuses');
      console.log('AppInitializer.tsx: Old likedBuses data cleared successfully!');
    } catch (error) {
      console.log('AppInitializer.tsx: Failed to clear likedBuses data:', error);
    }
  };
  // Call this function when needed
  // clearLikedBusesData();

  // Loading indicator
  return (
    <View style={containerStyles.globalContainer}>
      <ActivityIndicator
        size="large"
        color={colors.onBackgroundSecondary}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default AppInitializer;
