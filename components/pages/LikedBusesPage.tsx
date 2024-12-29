import React, { useState, useEffect } from "react";
import { Text, FlatList, View, ActivityIndicator } from 'react-native';


import { containerStyles } from "../../assets/styles/GlobalStyles";
import fetchBusArrival, { BusArrivalData } from '../apis/fetchBusArrival';
import { useLikedBuses } from "../context/likedBusesContext";
import BusComponent from '../main/BusComponent';


const LikedBusesPage = () => {
    const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // add more variables

    const { likedBuses, toggleLike} = useLikedBuses();

    useEffect(() => {
        const intervalId = setInterval(async () => {
          setIsLoading(true);
    
          try {
            // Loop through likedBuses and fetch arrival for each bus
            for (const entry of likedBuses) {
              const busId = entry[0];  // Get the first element of the entry (bus ID)
              const data = await fetchBusArrival(busId);  // Call fetchBusArrival for each bus ID
              setBusArrivalData(data)
            }
          } catch (error) {
            console.error('Error fetching bus arrival:', error);
          } finally {
            setIsLoading(false); // Set loading to false once the process is done
          }
        }, 5000); // 5 seconds
    
        return () => clearInterval(intervalId); // Cleanup on component unmount
      }, [likedBuses]);


    return (
        <View style={containerStyles.pageContainer}>
            {likedBuses.length > 0 ? (
              <Text style={containerStyles.globalTextMessage}>{JSON.stringify(likedBuses)}</Text>
            ) : (
              <Text style={containerStyles.globalTextMessage}>No liked buses</Text>
            )
          }
        </View>
    );
};

export default LikedBusesPage;