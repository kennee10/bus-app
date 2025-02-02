import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import fetchAllBusStops from "../components/apis/fetchAllBusStops";
import fetchAllBuses from "../components/apis/fetchAllBuses"; // Import the fetchAllBuses function

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
  const [isBusesFetchingComplete, setBusesFetchingComplete] = useState(false);

  // Fetch all bus stops
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        // Check if busStopsData already exists in AsyncStorage
        const storedBusStopsData = await AsyncStorage.getItem("busStopsData");
        // if (storedBusStopsData) {
        //   console.log("Bus stops data already exists in AsyncStorage. Skipping fetch.");
        //   setFetchingComplete(true); // Skip fetching bus stops
        //   return;
        // }

        // Fetch bus stops if data does not exist
        setFetchingComplete(true)
        await fetchAllBuses(); // Fetch bus stops first
        // setFetchingComplete(true); // Bus stops fetching complete
      } catch (error) {
        onError(error instanceof Error ? error.message : "Unknown error occurred during fetching");
      }
    };

    fetchBusStops();
  }, []);

  // Fetch all buses after bus stops are fetched
  useEffect(() => {
    if (isFetchingComplete) {
      const fetchBuses = async () => {
        try {
          // Check if busStopsData already exists in AsyncStorage
          const storedBusStopsData = await AsyncStorage.getItem("busStopsData");
          if (storedBusStopsData) {
            console.log("Bus stops data already exists in AsyncStorage. Skipping fetch.");
            setBusesFetchingComplete(true); // Skip fetching buses
            return;
          }

          // Fetch all buses if data does not exist
          await fetchAllBuses(); // Fetch all buses
          setBusesFetchingComplete(true); // Buses fetching complete
        } catch (error) {
          onError(error instanceof Error ? error.message : "Unknown error occurred during buses fetching");
        }
      };

      fetchBuses();
    }
  }, [isFetchingComplete]);

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

  // Check if all tasks are complete
  useEffect(() => {
    if (isFetchingComplete && isFontLoadingComplete && isBusesFetchingComplete) {
      onInitializationComplete(); // Notify parent that initialization is complete
    }
  }, [isFetchingComplete, isFontLoadingComplete, isBusesFetchingComplete]);

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