import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse } from '@babel/core';

// Define the context type
type LikedBusesContextType = {
    likedBuses: [string, string][];
    toggleLike: (busStopCode: string, serviceNo: string) => Promise<void>;
}

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined)

// Provider component
export const LikedBusesProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const[likedBuses, setLikedBuses] = useState<[string, string][]>([]);

    // Load liked buses from AsyncStorage on initial render
    useEffect(() => {
        const loadLikedBuses = async () => {
            try {
                const storedLikedBuses = await AsyncStorage.getItem('likedBuses');
                const parsedLikedBuses = storedLikedBuses ? JSON.parse(storedLikedBuses) : []
                setLikedBuses(parsedLikedBuses);
            } catch (error) {
                console.log('Failed to load liked buses: ', error);
            }
        };
        loadLikedBuses();
    }, [])

    // Function to toggle like/unlike a bus
    const toggleLike = async(busStopCode: string, serviceNo: string) => {
        try {

            const updatedLikedBuses: [string, string][] = likedBuses.some(
                ([code, service]) => code === busStopCode && service === serviceNo
            ) ? likedBuses.filter(
                ([code, service]) => !(code === busStopCode && service === serviceNo) // unlike
            ) : [...likedBuses, [busStopCode, serviceNo]]; // like

            // Update AsyncStorage
            await AsyncStorage.setItem('likedBuses', JSON.stringify(updatedLikedBuses));
            // Update State
            setLikedBuses(updatedLikedBuses);


        } catch (error) {
            console.log('Failed to toggle like for bus: ', error)
        }
    };

    return (
        <LikedBusesContext.Provider value={{ likedBuses, toggleLike }}>
            {children}
        </LikedBusesContext.Provider>
    );
};

// Hook to use the LikedBusesContext
export const useLikedBuses = (): LikedBusesContextType => {
    const context = useContext(LikedBusesContext);
    if (!context) {
        throw new Error('useLikedBuses must be used within a LikeBusesProvider');
    }
    return context;
}