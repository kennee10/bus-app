import React, { useState, useEffect } from "react";
import { Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import colors from '../assets/styles/Colors';
import GetLikedBusStops  from "../components/getLikedBusStops";
import BusStopComponent from '../components/main/BusStopComponent';


const LikedBusStops = () => {
  const [busStops, setBusStops] = useState<[code: string, description: string, roadName: string, distance: number][]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Retrieve liked bus stops
  useEffect(() => {
    (async () => {
      try {
        const likedBusStops = await GetLikedBusStops()
        setBusStops(likedBusStops)
        console.log(busStops)
      } catch {
        console.log("error")
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {busStops.length > 0 ? (
        <FlatList
          data={busStops}
          keyExtractor={(item, index) => item[0]} // Use the first element (code) as the key
          renderItem={({ item }) => {
            // Destructure the tuple into variables
            const [code, description, roadName, distance] = item;
            
            return (
              <BusStopComponent
                BusStopCode={code}
                Distance={distance.toFixed(0)}
                Description={description}
                RoadName={roadName}
              />
            );
          }}
        />
      ) : (
        <Text style={styles.messageText}>No Liked Bus Stops</Text>
      )}
  </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },


  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  messageText: {
    fontSize: scale(14),
    fontFamily: "Nunito-Bold",
    color: colors.text,
  },
});

export default LikedBusStops;
