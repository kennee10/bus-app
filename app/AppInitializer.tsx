import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { colors, containerStyles } from "../assets/styles/GlobalStyles";

interface AppInitializerProps {
  onInitializationComplete: () => void; // Called when both fetching and font loading are complete
  onError: (error: string) => void; // Called when an error occurs
}

const AppInitializer: React.FC<AppInitializerProps> = ({
  onInitializationComplete,
  onError,
}) => {
  const [isFontLoadingComplete, setFontLoadingComplete] = useState(false);

  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "Nunito-Medium": require("../assets/fonts/Nunito/Nunito-Medium.ttf"),
          "Nunito-SemiBold": require("../assets/fonts/Nunito/Nunito-SemiBold.ttf"),
          "Nunito-Bold": require("../assets/fonts/Nunito/Nunito-Bold.ttf"),
        });
        setFontLoadingComplete(true); // Fonts loaded successfully
      } catch (error) {
        onError("Error loading fonts");
      }
    };

    loadFonts();
  }, []);

  // Check if all tasks are complete
  useEffect(() => {
    if (isFontLoadingComplete) {
      onInitializationComplete(); // Notify parent that initialization is complete
    }
  }, [isFontLoadingComplete]);

  // Loading indicator
  return (
    <View style={containerStyles.globalContainer}>
      <ActivityIndicator
        size="large"
        color={colors.onBackgroundSecondary}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default AppInitializer;