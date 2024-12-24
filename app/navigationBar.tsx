import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text } from "react-native";

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import Index from "./index";
import LikedBusStops from "./likedBusStops";
import { LikedBusStopsProvider } from "../components/context/likedBusStopsContext";

function NearbyScreen() {
  return (
    <View style={containerStyles.globalContainer}>
      <Index />
    </View>
  );
}

function FavoriteBusesScreen() {
  return (
    <View style={containerStyles.globalContainer}>
      <Text>Buses</Text>
    </View>
  );
}

function FavoriteBusStopsScreen() {
  return (
    <View style={containerStyles.globalContainer}>
      <LikedBusStops />
    </View>
  );
}

function DonateScreen() {
  return (
    <View style={containerStyles.globalContainer}>
      <Text>Ads</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    // HOW i thought tab navigator only at bottom?
    <LikedBusStopsProvider>
      <Tab.Navigator
        initialRouteName="Nearby"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Nunito-Bold",
          },
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Nearby"
          component={NearbyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location-sharp" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Buses"
          component={FavoriteBusesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Bus Stops"
          component={FavoriteBusStopsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Ads"
          component={DonateScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="battery-charging" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </LikedBusStopsProvider>
  );
}
