import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


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
  toggleUnlike: (
    groupName: string,
    busStopCode: string,
    serviceNo: string
  ) => Promise<void>;
  createGroup: (groupName: string) => Promise<void>;
  deleteGroup: (groupName: string) => Promise<void>;
};

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined);

// Provider component
export const LikedBusesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBuses, setLikedBuses] = useState<GroupedLikedBuses>({ Pinned: {} });

  // Load liked buses from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBuses = async () => {
      try {
        const storedLikedBuses = await AsyncStorage.getItem('likedBuses');
        const parsedLikedBuses = storedLikedBuses ? JSON.parse(storedLikedBuses) : { Pinned: {} };
        setLikedBuses(parsedLikedBuses);
      } catch (error) {
        console.error('likedBusesContext.tsx: Failed to load liked buses: ', error);
      }
    };
    loadLikedBuses();
  }, []);

  // Helper function to save to AsyncStorage
  const saveToStorage = async (updatedLikedBuses: GroupedLikedBuses) => {
    try {
      await AsyncStorage.setItem('likedBuses', JSON.stringify(updatedLikedBuses));
      setLikedBuses(updatedLikedBuses);
    } catch (error) {
      console.error('likedBusesContext.tsx: Failed to save to storage: ', error);
      throw new Error('likedBusesContext.tsx: Failed to save changes');
    }
  };

  // Function to toggle like a bus within a group
  const toggleLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    try {
      if (!likedBuses[groupName]) {
        throw new Error(`Group ${groupName} does not exist`);
      }
  
      const group = likedBuses[groupName];
      const busServices = group[busStopCode] || [];
  
      // Add the serviceNo only if it's not already in the list
      const updatedBusServices = busServices.includes(serviceNo)
        ? busServices // Do nothing if the service is already liked
        : [...busServices, serviceNo]; // Like the bus
  
      // Update the group
      const updatedGroup = { ...group, [busStopCode]: updatedBusServices };
  
      // Update the main likedBuses state
      const updatedLikedBuses = { ...likedBuses, [groupName]: updatedGroup };
  
      await saveToStorage(updatedLikedBuses);
    } catch (error) {
      console.error('likedBusesContext.tsx: Failed to like bus: ', error);
      throw error;
    }
  };
  

  // Function to toggle unlike a bus from all groups
  const toggleUnlike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    try {
      const updatedLikedBuses = { ...likedBuses };
      let changes = false;

      // Remove the service from the specified group and busStopCode
      if (updatedLikedBuses[groupName]?.[busStopCode]) {
        const services = updatedLikedBuses[groupName][busStopCode];
        const updatedServices = services.filter(service => service !== serviceNo);
        
        if (updatedServices.length === 0) {
          delete updatedLikedBuses[groupName][busStopCode];
        } else {
          updatedLikedBuses[groupName][busStopCode] = updatedServices;
        }
        
        changes = true;
      }

      if (changes) {
        await saveToStorage(updatedLikedBuses);
      }
    } catch (error) {
      console.error('likedBusesContext.tsx: Failed to unlike bus: ', error);
      throw error;
    }
  };

  // Function to create a new group
  const createGroup = async (groupName: string) => {
    try {
      if (likedBuses[groupName]) {
        Alert.alert(
              "Duplicated Group",
              `Group "${groupName}" has already been created`,
              [
                {
                  text: "Cancel",
                  style: "cancel"
                }
              ]
            );
      }

      const updatedLikedBuses = { ...likedBuses, [groupName]: {} };
      await saveToStorage(updatedLikedBuses);
    } catch (error) {
      console.error('likedBusesContext.tsx: Failed to create group: ', error);
      throw error;
    }
  };

  // Function to delete a group
  const deleteGroup = async (groupName: string) => {
    try {
      if (!likedBuses[groupName]) {
        throw new Error(`likedBusesContext.tsx: Group ${groupName} does not exist`);
      }

      const updatedLikedBuses = { ...likedBuses };
      delete updatedLikedBuses[groupName];
      
      await saveToStorage(updatedLikedBuses);
    } catch (error) {
      console.error('likedBusesContext.tsx: Failed to delete group: ', error);
      throw error;
    }
  };

  return (
    <LikedBusesContext.Provider value={{ likedBuses, toggleLike, toggleUnlike, createGroup, deleteGroup }}>
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