import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar, Text } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { LikedBusStopsProvider } from "../components/context/likedBusStopsContext";
import { LikedBusesProvider } from "../components/context/likedBusesContext";
import AppInitializer from "./AppInitializer";
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme, ThemeProvider } from '../assets/styles/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  )
}

function RootLayoutContent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, colors, containerStyles } = useTheme();

  // Set navigation bar color on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colors.background)
        .catch(error => console.log("Error setting navigation bar color:", error));
    }
  }, [theme]);

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

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      width: "100%",
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 42 : 0,
    },
  });

  return (
    <>
      <ExpoStatusBar 
        style={theme === 'dark' ? "light" : "dark"}
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