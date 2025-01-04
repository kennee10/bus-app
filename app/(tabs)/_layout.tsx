import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale, verticalScale } from "react-native-size-matters";

import { colors } from "../../assets/styles/GlobalStyles";

export default function TabsLayout() {
  console.log("_layout.tsx: (tabs) Tabs layout rendering...");

  return (
    <Tabs
    initialRouteName="LikedBusesPage"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: scale(10),
          fontFamily: "Nunito-Bold",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: verticalScale(45),
          paddingBottom: scale(10),
          width: "100%",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Nearby",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusesPage"
        options={{
          tabBarLabel: "Buses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusStopsPage"
        options={{
          tabBarLabel: "Bus Stops",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="AdsPage"
        options={{
          tabBarLabel: "Ads",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="battery-charging" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
