import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import colors from '../../assets/styles/Colors';

type BusComponentProps = {
    busNumber: string;
    firstArrival: string;
    secondArrival: string;
    thirdArrival: string;
  };
  
const BusComponent: React.FC<BusComponentProps> = ({ 
    busNumber, 
    firstArrival, 
    secondArrival, 
    thirdArrival 
  }) => {
    
    return (
      <View style={styles.container}>
        <View style={styles.busNumberWrapper}>
          <Text style={styles.busNumber}>{busNumber}</Text>
        </View>
        <View style={styles.timingsWrapper}>
          <Text style={styles.timings}>{firstArrival}</Text>
          <Text style={styles.timings}>{secondArrival}</Text>
          <Text style={styles.timings}>{thirdArrival}</Text>
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
      flex: 1,
      // backgroundColor: 'purple',
    },
    timingsWrapper: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-between'
      // backgroundColor: 'brown',
    },
    busNumber: {
      flex: 1,
      color: 'blue',
      fontSize: scale(15),
      fontFamily: 'Nunito-Bold',
    },
    timings: {
      flex: 1,
      fontSize: scale(12),
      fontFamily: 'Nunito-Bold',
    }
});
  
  export default BusComponent;
  