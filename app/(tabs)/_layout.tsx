import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { colors, navigationBarHeight } from "../../assets/styles/GlobalStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  console.log("_layout.tsx(tabs): Tabs layout rendering...");

  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <Tabs
      initialRouteName="LikedBusesPage"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: scale(9),
          fontFamily: "Nunito-Bold",
        },
        tabBarStyle: {
          // backgroundColor: colors.background,
          backgroundColor: "red",
          borderTopWidth: 0,
          width: "100%",
          // height: navigationBarHeight,
          // paddingBottom: scale(10),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onBackgroundSecondary2,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Nearby",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "location" : "location-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusesPage"
        options={{
          tabBarLabel: "Buses",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LikedBusStopsPage"
        options={{
          tabBarLabel: "Bus Stops",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "star" : "star-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MorePage"
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
