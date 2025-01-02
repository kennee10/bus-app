import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, Text } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { scale } from "react-native-size-matters";
import { Stack } from "expo-router";

import { colors, containerStyles } from '../assets/styles/GlobalStyles';
import { LikedBusStopsProvider } from "../components/context/likedBusStopsContext";
import { LikedBusesProvider } from "../components/context/likedBusesContext";
import AppInitializer from "./AppInitializer";

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // console.log("Root layout rendering...");

  const handleFetchComplete = () => {
    setIsInitialized(true);
  };
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };
  
  if (!isInitialized) {
    console.log("_layout.tsx: (root) Initializing app");
    return <AppInitializer onFetchComplete={handleFetchComplete} onError={handleError} />
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text style={containerStyles.globalErrorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <ExpoStatusBar style="light" backgroundColor={colors.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <LikedBusStopsProvider>
          <LikedBusesProvider>
            <Stack
              screenOptions={{
                headerShown: false
              }}>
              <Stack.Screen name="(tabs)"/>
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
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || scale(42) : 0,
  },
});
