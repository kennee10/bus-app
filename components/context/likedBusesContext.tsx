import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define the structure of liked buses
interface BusGroup {
  isArchived?: boolean;
  busStops: {
    [busStopCode: string]: string[]; // busStopCode -> list of service numbers
  };
}

interface GroupedLikedBuses {
  [groupName: string]: BusGroup;
}

// Define the context type
type LikedBusesContextType = {
  likedBuses: GroupedLikedBuses;
  toggleLike: (groupName: string, busStopCode: string, serviceNo: string) => Promise<void>;
  toggleUnlike: (groupName: string, busStopCode: string, serviceNo: string) => Promise<void>;
  createGroup: (groupName: string) => Promise<void>;
  deleteGroup: (groupName: string) => Promise<void>;
  toggleIsArchived: (groupName: string) => Promise<void>;
};

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined);

// Provider component
export const LikedBusesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBuses, setLikedBuses] = useState<GroupedLikedBuses>({'Pinned' : {isArchived: false, busStops: {}}});

  // Load liked buses from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBuses = async () => {
      try {
        const storedLikedBuses = await AsyncStorage.getItem('likedBuses');
        setLikedBuses(storedLikedBuses ? JSON.parse(storedLikedBuses) : {});
      } catch (error) {
        console.error('Failed to load liked buses:', error);
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
      console.error('Failed to save to storage:', error);
    }
  };

  // Toggle like
  const toggleLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (!likedBuses[groupName]) return;

    const group = likedBuses[groupName];
    const busServices = group.busStops[busStopCode] || [];

    if (busServices.includes(serviceNo)) {
      Alert.alert('Already added', `${serviceNo} is already in "${groupName}"`);
      return;
    }

    const updatedBusStops = {
      ...group.busStops,
      [busStopCode]: [...busServices, serviceNo],
    };

    await saveToStorage({
      ...likedBuses,
      [groupName]: { ...group, busStops: updatedBusStops },
    });
  };

  // Toggle unlike
  const toggleUnlike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (!likedBuses[groupName]) return;

    const updatedBusStops = { ...likedBuses[groupName].busStops };
    updatedBusStops[busStopCode] = updatedBusStops[busStopCode].filter(s => s !== serviceNo);
    if (updatedBusStops[busStopCode].length === 0) delete updatedBusStops[busStopCode];

    await saveToStorage({
      ...likedBuses,
      [groupName]: { ...likedBuses[groupName], busStops: updatedBusStops },
    });
  };

  // Create a new group
  const createGroup = async (groupName: string) => {
    if (likedBuses[groupName]) {
      Alert.alert('Duplicated Group', `Group "${groupName}" already exists.`);
      return;
    }

    await saveToStorage({
      ...likedBuses,
      [groupName]: { isArchived: false, busStops: {} },
    });
  };

  // Delete a group
  const deleteGroup = async (groupName: string) => {
    if (!likedBuses[groupName]) return;

    const updatedLikedBuses = { ...likedBuses };
    delete updatedLikedBuses[groupName];
    await saveToStorage(updatedLikedBuses);
  };

  // Toggle isArchived
  const toggleIsArchived = async (groupName: string) => {
    if (!likedBuses[groupName]) return;

    const updatedGroup = {
      ...likedBuses[groupName],
      isArchived: !likedBuses[groupName].isArchived,
    };

    await saveToStorage({
      ...likedBuses,
      [groupName]: updatedGroup,
    });
  };

  return (
    <LikedBusesContext.Provider value={{ likedBuses, toggleLike, toggleUnlike, createGroup, deleteGroup, toggleIsArchived }}>
      {children}
    </LikedBusesContext.Provider>
  );
};

// Hook to use the LikedBusesContext
export const useLikedBuses = (): LikedBusesContextType => {
  const context = useContext(LikedBusesContext);
  if (!context) {
    throw new Error('useLikedBuses must be used within a LikedBusesProvider');
  }
  return context;
};
