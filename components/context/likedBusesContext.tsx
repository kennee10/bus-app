import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure of liked buses
interface GroupedLikedBuses {
  [groupName: string]: {
    [busStopCode: string]: string[]; // busStopCode -> list of service numbers
  };
}

// Define the context type
type LikedBusesContextType = {
  likedBuses: GroupedLikedBuses;
  toggleLike: (
    groupName: string,
    busStopCode: string,
    serviceNo: string
  ) => Promise<void>;
  createGroup: (groupName: string) => Promise<void>;
};

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined);

// Provider component
export const LikedBusesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBuses, setLikedBuses] = useState<GroupedLikedBuses>({ pinned: {} });

  // Load liked buses from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBuses = async () => {
      try {
        const storedLikedBuses = await AsyncStorage.getItem('likedBuses');
        const parsedLikedBuses = storedLikedBuses ? JSON.parse(storedLikedBuses) : { pinned: {} };
        setLikedBuses(parsedLikedBuses);
      } catch (error) {
        console.log('Failed to load liked buses: ', error);
      }
    };
    loadLikedBuses();
  }, []);

  // Function to toggle like/unlike a bus within a group
  const toggleLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    try {
      const group = likedBuses[groupName] || {};
      const busServices = group[busStopCode] || [];

      const updatedBusServices = busServices.includes(serviceNo)
        ? busServices.filter((service) => service !== serviceNo) // Unlike the bus
        : [...busServices, serviceNo]; // Like the bus

      // Update the group
      const updatedGroup = { ...group, [busStopCode]: updatedBusServices };
      if (updatedBusServices.length === 0) delete updatedGroup[busStopCode]; // Remove key if empty

      // Update the main likedBuses state
      const updatedLikedBuses = { ...likedBuses, [groupName]: updatedGroup };
      if (Object.keys(updatedGroup).length === 0) delete updatedLikedBuses[groupName]; // Remove group if empty

      // Persist to AsyncStorage
      await AsyncStorage.setItem('likedBuses', JSON.stringify(updatedLikedBuses));

      // Update state
      setLikedBuses(updatedLikedBuses);
    } catch (error) {
      console.log('Failed to toggle like for bus: ', error);
    }
  };

  // Function to create a new group
  const createGroup = async (groupName: string) => {
    try {
      if (likedBuses[groupName]) {
        console.log('Group already exists:', groupName);
        return;
      }

      const updatedLikedBuses = { ...likedBuses, [groupName]: {} };

      // Persist to AsyncStorage
      await AsyncStorage.setItem('likedBuses', JSON.stringify(updatedLikedBuses));

      // Update state
      setLikedBuses(updatedLikedBuses);
    } catch (error) {
      console.log('Failed to create group:', error);
    }
  };

  return (
    <LikedBusesContext.Provider value={{ likedBuses, toggleLike, createGroup }}>
      {children}
    </LikedBusesContext.Provider>
  );
};

// Hook to use the LikedBusesContext
export const useLikedBuses = (): LikedBusesContextType => {
  const context = useContext(LikedBusesContext);
  if (!context) {
    throw new Error('likedBusesContext.tsx: useLikedBuses must be used within a LikeBusesProvider');
  }
  return context;
};
