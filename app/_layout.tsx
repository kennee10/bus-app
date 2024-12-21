import React from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import colors from '../assets/styles/Colors';
import NavigationBar from "./navigationBar";

export default function RootLayout() {
  return (
    <>
      <ExpoStatusBar style="light" backgroundColor={colors.background} />
      {/* Wrap content in SafeAreaView to prevent overlap */}
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Background color of your app
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 42 : 0, // Add padding for Android.
  },
});
