import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
        <Text style={styles.busNumber}>{busNumber}</Text>
        <Text>{firstArrival} | {secondArrival} | {thirdArrival}</Text>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'green',
      alignItems: 'center'
    },
    header: { backgroundColor: "#f0f0f0", padding: 10 },
    title: { fontSize: 18 },

    busNumber: { color: 'blue'}
});
  
  export default BusComponent;
  