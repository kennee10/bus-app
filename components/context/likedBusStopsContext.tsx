import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the context type
type LikedBusStopsContextType = {
  likedBusStops: string[]; // List of liked bus stop codes
  likedBusStopsOrder: string[]; // Ordered list of bus stop codes
  toggleLike: (busStopCode: string) => Promise<void>;
  updateLikedBusStopsOrder: (newOrder: string[]) => Promise<void>;
};

// Create Context
const LikedBusStopsContext = createContext<LikedBusStopsContextType | undefined>(undefined);

// Provider component
export const LikedBusStopsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBusStops, setLikedBusStops] = useState<string[]>([]);
  const [likedBusStopsOrder, setLikedBusStopsOrder] = useState<string[]>([]);

  // Load liked bus stops and their order from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBusStops = async () => {
      try {
        const storedData = await AsyncStorage.getItem('likedBusStops');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setLikedBusStops(parsedData.likedBusStops || []);
          setLikedBusStopsOrder(parsedData.order || []);
        }
      } catch (error) {
        console.error('Failed to load liked bus stops:', error);
      }
    };
    loadLikedBusStops();
  }, []);

  // Function to toggle like/unlike a bus stop
  const toggleLike = async (busStopCode: string) => {
    try {
      const updatedLikedBusStops = likedBusStops.includes(busStopCode)
        ? likedBusStops.filter((code) => code !== busStopCode) // Unlike
        : [...likedBusStops, busStopCode]; // Like
  
      // Update the order: Remove the bus stop if unliked, or add it to the end if liked
      const updatedOrder = likedBusStops.includes(busStopCode)
        ? likedBusStopsOrder.filter((code) => code !== busStopCode) // Remove from order if unliked
        : [...likedBusStopsOrder, busStopCode]; // Add to the end of the order if liked
  
      // Update AsyncStorage
      const updatedData = {
        likedBusStops: updatedLikedBusStops,
        order: updatedOrder,
      };
      await AsyncStorage.setItem('likedBusStops', JSON.stringify(updatedData));
  
      // Update state
      setLikedBusStops(updatedLikedBusStops);
      setLikedBusStopsOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to toggle like for bus stop:', error);
    }
  };

  // Function to update the order of liked bus stops
  const updateLikedBusStopsOrder = async (newOrder: string[]) => {
    try {
      // Update AsyncStorage
      const updatedData = {
        likedBusStops,
        order: newOrder,
      };
      await AsyncStorage.setItem('likedBusStops', JSON.stringify(updatedData));

      // Update state
      setLikedBusStopsOrder(newOrder);
    } catch (error) {
      console.error('Failed to update liked bus stops order:', error);
    }
  };

  return (
    <LikedBusStopsContext.Provider
      value={{ likedBusStops, likedBusStopsOrder, toggleLike, updateLikedBusStopsOrder }}
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