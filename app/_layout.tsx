import React from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { colors } from '../assets/styles/GlobalStyles';
import NavigationBar from "./navigationBar";

export default function RootLayout() {
  return (
    <>
      <ExpoStatusBar style="light" backgroundColor={colors.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <NavigationBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 42 : 0,
  },
});
