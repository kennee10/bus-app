import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the context type
type LikedStopsContextType = {
    likedStops: string[];
    setLikedStops: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create Context
const LikedStopsContext = createContext<LikedStopsContextType | undefined>(undefined)

export const LikedStopsProvider = ({children}: {children: ReactNode}) => {
    const[likedStops, setLikedStops] = useState<string[]>([]);

    // Load persisted data when the component mounts
    useEffect(() => {
        const loadLikedStops = async () => {
            const storedStops = await AsyncStorage.getItem('likedBusStops');
            if (storedStops) setLikedStops(JSON.parse(storedStops));
        };
        loadLikedStops();
    }, [])

    // Update persistent storage whenever likeStops changes
    useEffect(() => {
        AsyncStorage.setItem('likedBusStops', JSON.stringify(likedStops));
    }, [likedStops]);

    return (
        <LikedStopsContext.Provider value={{ likedStops, setLikedStops }}>
            {children}
        </LikedStopsContext.Provider>
    );
};

export const useLikedStops = (): LikedStopsContextType => {
    const context = useContext(LikedStopsContext);
    if (!context) {
        throw new Error('useLikedStops must be used within a LikedStopsProvider');
    }
    return context;

}