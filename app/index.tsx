import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

import AppInitializer from "./AppInitializer";
import { containerStyles } from '../assets/styles/GlobalStyles';
import BusStopsNearbyComponent from "./nearbyBusStops";

export default function index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchComplete = () => {
    setIsInitialized(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isInitialized) {
    console.log("index.tsx: initializing app")
    return <AppInitializer onFetchComplete={handleFetchComplete} onError={handleError} />;
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text style={containerStyles.globalErrorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      <BusStopsNearbyComponent />
    </SafeAreaView>
  );
}
