import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import colors from '../assets/styles/Colors';
import Index from './index'

// Screens for each tab
function NearbyScreen() {
  return (
    <View style={styles.screenContainer}>
      <Index/>
    </View>
  );
}

function FavoriteBusesScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Buses</Text>
    </View>
  );
}

function FavoriteBusStopsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Bus Stops</Text>
    </View>
  );
}

function DonateScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Donate</Text>
    </View>
  );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName="Nearby"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: scale(10),
          fontFamily: 'Nunito-Bold',
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
        },
        
        tabBarActiveTintColor: "white", // Active tab color
        tabBarInactiveTintColor: "gray", // Inactive tab color
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
            <Ionicons name="star" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bus Stops"
        component={FavoriteBusStopsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Donate"
        component={DonateScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1
  },
});