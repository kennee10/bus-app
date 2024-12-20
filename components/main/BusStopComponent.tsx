import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import colors from '../../assets/styles/Colors';;
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

    // fetchFonts();
    
    // Fetch bus arrival data every 5 seconds
    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          const data = await fetchBusArrival(BusStopCode);
          setBusArrivalData(data); // Set the fetched bus data
        } catch (error) {
          console.error("Failed to fetch bus data", error);
        }
      }, 5000); // 5 seconds

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, [BusStopCode]);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.container}>
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
        </View>
        
        <View style={styles.lower}>
          <Text style={styles.blackSpace1}> </Text>
          <Text style={styles.roadName}>{RoadName}</Text>
          <Text style={styles.blackSpace2}></Text>
        </View>
      </TouchableOpacity>

      {/* When user press on a bus stop */}
      {!isCollapsed && busArrivalData && (
        <View style={styles.busesContainer}>
          {Object.entries(busArrivalData).map(([busNumber, timings]) => (
            <BusComponent
              key={busNumber}
              busNumber={busNumber}
              firstArrival={timings[0] || "No data"}
              secondArrival={timings[1] || "No data"}
              thirdArrival={timings[2] || "No data"}
            />
          ))}
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
    flexDirection: 'row',
  },
  lower: {
    flex: 1,
    height: scale(25),
    flexDirection: 'row',
  },
  busStopCodeWrapper: {
    flex: 3,

  },
  descriptionWrapper: {
    flex: 9,

  },
  distanceWrapper: {
    flex: 2,

  },
  busStopCode: {
    fontSize: scale(15),
    lineHeight: scale(30),
    paddingLeft: scale(5),
    fontFamily: 'Nunito-Bold',
    color: colors.text
    // backgroundColor: 'purple',
  },
  description: {
    fontSize: scale(18),
    lineHeight: scale(30),
    fontFamily: 'Nunito-Bold',
    color: colors.text
    // backgroundColor: 'red',
  },
  distance: {
    fontSize: scale(12),
    lineHeight: scale(30),
    paddingRight: scale(5),
    textAlign: 'right',
    fontFamily: 'Nunito-Bold',
    color: colors.text
    // backgroundColor: 'yellow',
  },
  
  roadName: {
    flex: 9,
    fontSize: scale(14),
    height: scale(25),
    fontFamily: 'Nunito-Bold',
    color: colors.text
    // backgroundColor: 'brown',
  },
  blackSpace1: {
    flex: 3
  },
  blackSpace2: {
    flex: 2
  },

  busesContainer: {
    flex: 1,
    // padding: scale(4)
  }
});

export default BusStopComponent;
