import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, Text } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { scale } from "react-native-size-matters";
import { Stack } from "expo-router";


import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import { LikedBusStopsProvider } from "../components/context/likedBusStopsContext";
import { LikedBusesProvider } from "../components/context/likedBusesContext";
import AppInitializer from "./AppInitializer";

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false); // Tracks whether initialization is complete
  const [error, setError] = useState<string | null>(null); // Tracks errors during initialization

  const handleInitializationComplete = () => {
    setIsInitialized(true); // Mark initialization as complete
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage); // Store the error message
  };

  // If not initialized, show the AppInitializer
  if (!isInitialized) {
    console.log("_layout.tsx(root): Initializing app...");
    return (
      <AppInitializer
        onInitializationComplete={handleInitializationComplete}
        onError={handleError}
      />
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <SafeAreaView style={containerStyles.globalContainer}>
        <Text style={containerStyles.globalErrorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Render the app after initialization
  return (
    <>
      <ExpoStatusBar style="light" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <LikedBusStopsProvider>
          <LikedBusesProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" />
            </Stack>
          </LikedBusesProvider>
        </LikedBusStopsProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || scale(42) : 0,
  },
});
