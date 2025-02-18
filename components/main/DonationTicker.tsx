import { colors, font } from "@/assets/styles/GlobalStyles";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";

// Define donations with a type annotation
const donations: string[] = [
  // Add your donation messages here
//   "Fellycia donated $10.40",
//   "Yenn donated $5.00",
//   "Yenn2 donated $5.00",
//   "Yenn3 donated $5.00",
//   "Yenn4 donated $5.00",
//   "Yenn5 donated $5.00",
  // etc.
];

const { width } = Dimensions.get("window");

export default function DonationDisplay() {
  const [currentDonationIndex, setCurrentDonationIndex] = useState<number>(0); // Type for current donation index
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(1)).current; // Type for fadeAnim (Animated.Value)

  useEffect(() => {
    if (donations.length > 0) {
      const interval = setInterval(() => {
        // Fade out the current donation
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 250, // Duration of fade out
          useNativeDriver: true,
        }).start(() => {
          // After fade out, move to the next donation and fade it in
          setCurrentDonationIndex((prevIndex) => (prevIndex + 1) % donations.length);

          // Fade in the next donation
          Animated.timing(fadeAnim, {
            toValue: 1, // Fade in
            duration: 350, // Duration of fade in
            useNativeDriver: true,
          }).start();
        });
      }, 1800); // Change donation every 2.5 seconds

      return () => clearInterval(interval); // Clean up interval when component unmounts
    }
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.containerHeader}>This week's donations</Text>
      {donations.length > 0 ? (
        <Animated.View
          style={[
            styles.donationContainer,
            { opacity: fadeAnim }, // Apply the fade effect
          ]}
        >
          <Text style={styles.donationText}>{donations[currentDonationIndex]}</Text>
        </Animated.View>
      ) : (
        <Text style={styles.noDonationsText}>-</Text> // Display a message when the donations array is empty
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: colors.surface3,
    marginTop: scale(10),
    borderRadius: scale(4),
    paddingVertical: scale(6),
    justifyContent: "center", // Center the donation message vertically
    alignItems: "center", // Center the donation message horizontally
  },
  containerHeader: {
    fontSize: scale(10.5),
    fontFamily: font.semiBold,
    marginBottom: scale(4),
    color: colors.onSurfaceSecondary2,
  },
  donationContainer: {
    width: width, // Ensure container takes up full width
    alignItems: "center", // Center the text
  },
  donationText: {
    fontSize: scale(13),
    fontFamily: font.semiBold,
    color: colors.primary,
  },
  noDonationsText: {
    fontSize: scale(13),
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary2,
  },
});
