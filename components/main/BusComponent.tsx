import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, font } from '../../assets/styles/GlobalStyles';

type BusComponentProps = {
    busNumber: string;
    busStopCode: string;
    firstArrival: string;
    secondArrival: string;
    thirdArrival: string;
    isHearted: boolean;
    onHeartToggle: (busStopCode: string, serviceNo: string) => void;
  };
  
const BusComponent: React.FC<BusComponentProps> = ({ 
    busNumber,
    busStopCode,
    firstArrival, 
    secondArrival, 
    thirdArrival,
    isHearted,
    onHeartToggle,
  }) => {
    
    return (
      <View style={styles.container}>
        <View style={styles.busNumberWrapper}>
          <Text style={styles.busNumber}>{busNumber}</Text>
        </View>
        <View style={styles.timingsWrapper}>
          <Text style={styles.busStopCode}>{busStopCode}</Text>
          <Text style={styles.timings}>{firstArrival}</Text>
          <Text style={styles.timings}>{secondArrival}</Text>
          <Text style={styles.timings}>{thirdArrival}</Text>
        </View>
        <View style={styles.likeButtonWrapper}>
          <TouchableOpacity onPress={() => onHeartToggle(busStopCode, busNumber)}>
            <Ionicons 
              name={isHearted? "heart" : "heart-outline"}
              color={isHearted? "red": "gray"}
              size={scale(18)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(4),
      backgroundColor: colors.accent,
      flexDirection: 'row',
      height: '100%'
    },
    busNumberWrapper: {
      flex: 2,
      // backgroundColor: 'purple',
    },
    timingsWrapper: {
      flex: 7,
      flexDirection: 'row',
      justifyContent: 'space-between'
      // backgroundColor: 'brown',
    },
    likeButtonWrapper: {
      flex: 1,
      alignItems: 'center',
      // backgroundColor: 'red'

    },

    busNumber: {
      flex: 1,
      color: 'blue',
      fontSize: scale(15),
      fontFamily: font.bold,
    },
    timings: {
      flex: 1,
      fontSize: scale(12),
      fontFamily: font.bold,
    },
    busStopCode: {
      flex: 1,
      fontSize: scale(8),
      fontFamily: font.bold,
    }
});
  
  export default BusComponent;
  