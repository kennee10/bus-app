import React, { useState, useEffect } from "react";
import { Text, FlatList, View, ActivityIndicator } from 'react-native';

import { containerStyles } from "../../assets/styles/GlobalStyles";
import BusComponent from '../main/BusComponent';
import fetchBusArrival, { BusArrivalData } from '../fetchBusArrival';
import { useLikedBuses } from "../context/likedBusesContext";

const LikedBusesComponent = () => {
    const [busArrivalData, setBusArrivalData] = useState<BusArrivalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Access liked buses and the toggleLike function from context
    const { likedBuses, toggleLike } = useLikedBuses();

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                // Assuming the `fetchBusArrival` function takes busStopCode as argument
                const fetchBusArrivalData = async (busStopCode: string) => {
                    const data = await fetchBusArrival(busStopCode);
                    setBusArrivalData((prevData) => ({
                        ...prevData,
                        [busStopCode]: data,
                    }));
                };

                if (likedBuses.length > 0) {
                    likedBuses.forEach(([busStopCode]) => {
                        fetchBusArrivalData(busStopCode);
                    });
                }
            } catch (error) {
                console.log('Error fetching bus arrival data: ', error);
            } finally {
                setIsLoading(false);
            }
        }, 5000); // Fetch data every 5 seconds

        // Cleanup function to clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [likedBuses]);

    // Function to render each bus in the liked buses list
    const renderBusComponent = ({ item }: { item: [string, string] }) => {
        const [busStopCode, serviceNo] = item;
        const arrivalData = busArrivalData ? busArrivalData[busStopCode] : null;

        // Extract first, second, and third arrivals from arrival data
        const firstArrival = arrivalData ? arrivalData[0]?.arrivalTime || "N/A" : "N/A";
        const secondArrival = arrivalData ? arrivalData[1]?.arrivalTime || "N/A" : "N/A";
        const thirdArrival = arrivalData ? arrivalData[2]?.arrivalTime || "N/A" : "N/A";

        // Check if this bus is hearted (liked)
        const isHearted = likedBuses.some(([code, service]) => code === busStopCode && service === serviceNo);

        return (
            <BusComponent
                busNumber={serviceNo}
                busStopCode={busStopCode}
                firstArrival={firstArrival}
                secondArrival={secondArrival}
                thirdArrival={thirdArrival}
                isHearted={isHearted}
                onHeartToggle={toggleLike}  // Pass the toggleLike function
            />
        );
    };

    return (
        <View style={containerStyles.pageContainer}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : likedBuses.length > 0 ? (
                <FlatList
                    data={likedBuses}
                    renderItem={renderBusComponent}
                    keyExtractor={([busStopCode, serviceNo]) => `${busStopCode}-${serviceNo}`}
                />
            ) : (
                <Text style={containerStyles.globalTextMessage}>No Liked Buses</Text>
            )}
        </View>
    );
};

export default LikedBusesComponent;
