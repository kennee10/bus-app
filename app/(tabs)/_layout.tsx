import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { colors } from "../../assets/styles/GlobalStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  console.log("_layout.tsx(tabs): Tabs layout rendering...");

  const insets = useSafeAreaInsets();

  const iconSize = 24; // Default Ionicons size
  const labelFontSize = scale(9);
  const verticalPadding = scale(6);
  const tabBarHeight = iconSize + labelFontSize + verticalPadding * 2 + insets.bottom;

  return (
    <Tabs
      initialRouteName="LikedBusesPage"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          fontFamily: "Nunito-Bold",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          width: "100%",
          height: tabBarHeight + scale(10),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onBackgroundSecondary2,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Nearby",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "location" : "location-outline"}
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusesPage"
        options={{
          tabBarLabel: "Buses",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusStopsPage"
        options={{
          tabBarLabel: "Bus Stops",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MorePage"
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"}
              color={color}
              size={iconSize}
            />
          ),
        }}
      />
    </Tabs>
  );
}
