import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the context type
type LikedBusStopsContextType = {
  likedBusStopsOrder: string[]; // Ordered list of bus stop codes
  toggleLike: (busStopCode: string) => Promise<void>;
  updateLikedBusStopsOrder: (newOrder: string[]) => Promise<void>;
};

// Create Context
const LikedBusStopsContext = createContext<LikedBusStopsContextType | undefined>(undefined);

// Provider component
export const LikedBusStopsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBusStopsOrder, setLikedBusStopsOrder] = useState<string[]>([]);

  // Load liked bus stops from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBusStops = async () => {
      try {
        const storedData = await AsyncStorage.getItem('likedBusStops');
        setLikedBusStopsOrder(storedData ? JSON.parse(storedData) : []);
      } catch (error) {
        console.error('Failed to load liked bus stops:', error);
      }
    };
    loadLikedBusStops();
  }, []);

  // Function to toggle like/unlike a bus stop
  const toggleLike = async (busStopCode: string) => {
    try {
      const updatedOrder = likedBusStopsOrder.includes(busStopCode)
        ? likedBusStopsOrder.filter((code) => code !== busStopCode) // Remove if unliked
        : [...likedBusStopsOrder, busStopCode]; // Add to the end if liked

      // Update AsyncStorage
      await AsyncStorage.setItem('likedBusStops', JSON.stringify(updatedOrder));

      // Update state
      setLikedBusStopsOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to toggle like for bus stop:', error);
    }
  };

  // Function to update the order of liked bus stops
  const updateLikedBusStopsOrder = async (newOrder: string[]) => {
    try {
      // Update AsyncStorage
      await AsyncStorage.setItem('likedBusStops', JSON.stringify(newOrder));

      // Update state
      setLikedBusStopsOrder(newOrder);
    } catch (error) {
      console.error('Failed to update liked bus stops order:', error);
    }
  };

  return (
    <LikedBusStopsContext.Provider
      value={{ likedBusStopsOrder, toggleLike, updateLikedBusStopsOrder }}
    >
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
};
