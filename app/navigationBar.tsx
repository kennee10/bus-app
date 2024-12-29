import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, Platform } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

import { colors, containerStyles } from "../assets/styles/GlobalStyles";
import Index from "./index";
import LikedBusesPage from "../components/pages/LikedBusesPage";
import LikedBusStopsPage from "../components/pages/LikedBusStopsPage";


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
      <LikedBusesPage />
    </View>
  );
}

function FavoriteBusStopsScreen() {
  return (
    <View style={containerStyles.globalContainer}>
      <LikedBusStopsPage />
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
    <Tab.Navigator
      initialRouteName="Nearby"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: scale(10),
          fontFamily: "Nunito-Bold",
          flexWrap: "wrap", // * Testing if it fixes bug
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          // backgroundColor: 'red',
          borderTopWidth: 0,
          height: verticalScale(45),
          paddingBottom: scale(20)
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{
          tabBarLabel: "Nearby", // * Testing if it fixes bug
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
  );
}
