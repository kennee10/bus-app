import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import AppInitializer from "../components/AppInitializer";
import BusStopsNearbyComponent from "../components/main/BusStopsNearbyComponent";

export default function App() {
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
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BusStopsNearbyComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'violet',
  },
  
  // ONLY WHEN ERROR
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
