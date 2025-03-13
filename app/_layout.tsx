import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, Text } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { scale } from "react-native-size-matters";
import { Stack } from "expo-router";
import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import { LikedBusStopsProvider } from "../components/context/likedBusStopsContext";
import { LikedBusesProvider } from "../components/context/likedBusesContext";
import AppInitializer from "./AppInitializer";
import * as NavigationBar from 'expo-navigation-bar'; // Add this import
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set navigation bar color on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colors.background)
        .catch(error => console.log("Error setting navigation bar color:", error));
    }
  }, []);

  const handleInitializationComplete = () => {
    setIsInitialized(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isInitialized) {
    return (
      <AppInitializer
        onInitializationComplete={handleInitializationComplete}
        onError={handleError}
      />
    );
  }

  if (error) {
    return (
      <SafeAreaView style={containerStyles.globalContainer}>
        <Text style={containerStyles.globalErrorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <ExpoStatusBar 
        style="light" 
        backgroundColor={colors.background} 
      />
      <SafeAreaView style={styles.safeArea}>
        <LikedBusStopsProvider>
          <LikedBusesProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                // Add these to style any header that might appear
                headerStyle: {
                  backgroundColor: colors.background,
                },
                headerTintColor: colors.onBackground,
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 42 : 0,
  },
});