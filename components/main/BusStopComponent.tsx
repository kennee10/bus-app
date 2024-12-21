import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../../assets/styles/Colors';
import BusComponent from "./BusComponent";
import fetchBusArrival, { BusArrivalData } from "../fetchBusArrival";

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
};



const BusStopComponent: React.FC<BusStopComponentProps> = ({
    BusStopCode,
    Description,
    RoadName,
    Distance,
  }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = async () => {
      setIsLiked(!isLiked)
    }
    
    // Fetch bus arrival data every 5 seconds
    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          const data = await fetchBusArrival(BusStopCode);
          setBusArrivalData(data); // Set the fetched bus data
        } catch (error) {
          console.error("Failed to fetch bus data", error);
        } finally {
          setIsLoading(false)
        }
      }, 5000); // 5 seconds

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, [BusStopCode]);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.container}>
        {/* Upper */}
        <View style={styles.upper}>
          <View style={styles.busStopCodeWrapper}>
            <Text style={styles.busStopCode}>{BusStopCode}</Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{Description}</Text>
          </View>
          <View style={styles.distanceWrapper}>
            <Text style={styles.distance}>{Distance}m</Text>
          </View>
          <View style={styles.likeButtonWrapper}>
            <TouchableOpacity onPress={toggleLike}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                color={isLiked ? "red" : "gray"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Lower */}
        <View style={styles.lower}>
          <View style={styles.blackSpace1}></View>
          <View style={styles.roadNameWrapper}>
            <Text style={styles.roadName}>{RoadName}</Text>
          </View>
          
          <View style={styles.blackSpace2}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#666"/>
            ) : <View></View>}
          </View>
        </View>
      </TouchableOpacity>

      {/* When user press on a bus stop */}
      {!isCollapsed && (
        <View style={styles.busesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#666" />
          ) : busArrivalData && Object.keys(busArrivalData).length > 0 ? (
            Object.entries(busArrivalData).map(([busNumber, timings]) => (
              <BusComponent
                key={busNumber}
                busNumber={busNumber}
                firstArrival={timings[0] || "No data"}
                secondArrival={timings[1] || "No data"}
                thirdArrival={timings[2] || "No data"}
              />
            ))
          ) : (
            // Render a message when there are no buses
            <Text style={styles.noBusesText}>
              No buses are currently in operation.
            </Text>
          )}
        </View>
      )}



    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: scale(340),
    overflow: 'hidden',
    marginTop: verticalScale(10),
    borderRadius: scale(4),
    backgroundColor: colors.secondaryBackground,
    // height: '100%', // dk if need
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  upper: {
    flex: 1,
    height: scale(30),
    width: '100%',
    flexDirection: 'row',
  },
  lower: {
    flex: 1,
    height: scale(25),
    width: '100%',
    flexDirection: 'row',
  },


  busStopCodeWrapper: {
    flex: 6,
    // backgroundColor: 'purple',
  },
  descriptionWrapper: {
    flex: 15,
    // backgroundColor: 'red',
  },
  distanceWrapper: {
    flex: 4,
    // backgroundColor: 'yellow',
  },
  likeButtonWrapper: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'blue',
  },

  busStopCode: {
    fontSize: scale(15),
    lineHeight: scale(30),
    paddingLeft: scale(5),
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },
  description: {
    fontSize: scale(18),
    lineHeight: scale(30),
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },
  distance: {
    fontSize: scale(12),
    lineHeight: scale(30),
    paddingRight: scale(5),
    textAlign: 'right',
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },
  likeButton: {
    // backgroundColor: 'red',
  },

  blackSpace1: {
    flex: 6,
    // backgroundColor: 'purple',
  },
  roadNameWrapper: {
    flex: 15,
    height: scale(25),
    // backgroundColor: 'brown',
  },
  blackSpace2: {
    flex: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: scale(5),
    // backgroundColor: 'blue',
  },
  roadName: {
    fontSize: scale(14),
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },


  // After pressing
  busesContainer: {
    flex: 1,
    backgroundColor: colors.accent,
  },

  noBusesText: {
    flex: 1,
    fontFamily: 'Nunito-Bold',
    color: 'red',
    textAlign: 'center'
  }
});

export default BusStopComponent;
