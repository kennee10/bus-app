import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import fetchBusStops from "../components/apis/fetchBusStops";


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
        await fetchBusStops();
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


  if (isFetching && !isFontsLoaded) {
    return (
      <View style={containerStyles.globalContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{flex:1}}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default AppInitializer;
