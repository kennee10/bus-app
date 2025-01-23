import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import fetchAllBusStops from "../components/apis/fetchAllBusStops";


interface AppInitializerProps {
  onFetchComplete: () => void;
  onError: (error: string) => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ onFetchComplete, onError }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [isFontsLoaded, setFontsLoaded] = useState(false);

  // Fetch all bus stops
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchAllBusStops();
        onFetchComplete(); // Notify parent about success

      } catch (error) {
        onError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsFetching(false); // For loading indicator
      }
    };

    initializeApp();
  }, []);

  // Load fonts
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

  const clearLikedBusesData = async () => {
    try {
      // Remove the old data for 'likedBuses'
      await AsyncStorage.removeItem('likedBuses');
      console.log('Old likedBuses data cleared successfully!');
    } catch (error) {
      console.log('Failed to clear likedBuses data:', error);
    }
  };
  // Call this function when needed
  // clearLikedBusesData();

  // If still loading
  if (isFetching && !isFontsLoaded) {
    return (
      <View style={containerStyles.globalContainer}>
        <ActivityIndicator
          size="large"
          color={colors.onBackgroundSecondary}
          style={{flex:1}}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default AppInitializer;
