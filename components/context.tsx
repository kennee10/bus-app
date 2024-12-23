import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the context type
type LikedBusStopsContextType = {
    likedBusStops: string[];
    toggleLike: (busStopCode: string) => Promise<void>;
}

// Create Context
const LikedBusStopsContext = createContext<LikedBusStopsContextType | undefined>(undefined)

// Provider component
export const LikedBusStopsProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const[likedBusStops, setLikedBusStops] = useState<string[]>([]);

    // Load liked bus stops from AsyncStorage on initial render
    useEffect(() => {
        const loadLikedBusStops = async () => {
            try {
                const storedLikedStops = await AsyncStorage.getItem('likedBusStops');
                const parsedLikedStops = storedLikedStops ? JSON.parse(storedLikedStops) : [];
                setLikedBusStops(parsedLikedStops);
            } catch (error) {
                console.log('Failed to load liked bus stops: ', error);
            }
        };
        loadLikedBusStops();
    }, [])

    // Function to toggle like/unlike a bus stop
    const toggleLike = async (busStopCode: string) => {
        try {
            const updatedLikedBusStops = likedBusStops.includes(busStopCode)
                ? likedBusStops.filter((code) => code !== busStopCode) // Unlike
                : [...likedBusStops, busStopCode] // Like
            
            // Update AsyncStorage
            await AsyncStorage.setItem('likedBusStops', JSON.stringify(updatedLikedBusStops));
            // Update state
            setLikedBusStops(updatedLikedBusStops);
        } catch (error) {
            console.error('Failed to toggle like for bus stop:', error);
        }
    };

    return (
        <LikedBusStopsContext.Provider value={{ likedBusStops, toggleLike }}>
            {children}
        </LikedBusStopsContext.Provider>
    );
};

// Hook to use the LikedBusStopsContext
export const useLikedBusStops = (): LikedBusStopsContextType => {
    const context = useContext(LikedBusStopsContext);
    if (!context) {
        throw new Error('useLikedBusStops must be used within a LikedBusStopsProvider');
    }
    return context;
}