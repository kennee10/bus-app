import React, { useState } from "react";
import { SafeAreaView, Text } from "react-native";

import { containerStyles } from '../assets/styles/GlobalStyles';
import AppInitializer from "./AppInitializer";
import BusStopsNearbyComponent from "../components/pages/nearbyBusStops";

export default function index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("index.tsx: isInitialized = ", isInitialized);

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
  // returning this somehow shows console logs
  return (
    <SafeAreaView style={containerStyles.pageContainer}>
      <BusStopsNearbyComponent />
    </SafeAreaView>
  );
}
