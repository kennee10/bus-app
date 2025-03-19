import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Platform } from "react-native";
import { useTheme } from '../../assets/styles/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  console.log("_layout.tsx(tabs): Tabs layout rendering...");

  return (
    <Tabs
      initialRouteName="LikedBusesPage"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: "Nunito-Bold",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          paddingBottom: 20,
          width: "100%",
          height: Platform.OS === "android" ? 55 : 50,
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
