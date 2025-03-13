import { colors, font } from "@/assets/styles/GlobalStyles";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";


const donations: string[] = [
  "🥇 Alexei donated $20.00",  
  "🥈 Sam donated $15.50",  
  "🥉 Jordan donated $10.00",  
  "Emily donated $7.25",  
  // "Chris donated $5.00",  
  // "Nathaniel donated $12.75",  
  // "Ava donated $8.50",  
  // "Zoe donated $6.00",  
  // "Jonathan donated $14.20",  
  // "Mia donated $9.00",  
  // "Benjamin donated $13.33",  
  // "Olivia donated $11.80",  
  // "Ethan donated $6.75",  
  // "Sophie donated $7.90",  
  // "Daniel donated $10.50",  
  // "Charlotte donated $5.60",  
  // "Leo donated $8.20",  
  // "Madeline donated $6.40",  
  // "Xander donated $9.99",  
  // "Isabella donated $4.75",  
  // "Tyler donated $5.50",  
  // "Victoria donated $13.00",  
  // "Ryan donated $11.25",  
  // "Grace donated $7.00",  
  // "Sebastian donated $14.50",  
  // "Lily donated $6.90",  
  // "Matthew donated $9.80",  
  // "Hannah donated $10.25",  
  // "Jasper donated $8.75",  
  // "Seraphina donated $12.00", 
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
      <Text style={styles.containerHeader}>This week's donations & Leaderboard 🥇🥈🥉</Text>
      {donations.length > 0 ? (
        <Animated.View
          style={[
            styles.donationContainer,
            { opacity: fadeAnim }, // Apply the fade effect
          ]}
        >
          <Text style={styles.donationText} adjustsFontSizeToFit numberOfLines={1}>{donations[currentDonationIndex]}</Text>
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
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 6,
    justifyContent: "center", // Center the donation message vertically
    alignItems: "center", // Center the donation message horizontally
  },
  containerHeader: {
    fontSize: 10.5,
    fontFamily: font.semiBold,
    marginBottom: 4,
    color: colors.onSurfaceSecondary2,
  },
  donationContainer: {
    flex: 1,
    alignItems: "center", // Center the text
  },
  donationText: {
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    fontFamily: font.semiBold,
    color: colors.primary,
  },
  noDonationsText: {
    fontSize: 13,
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary2,
  },
});
