import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


interface LikedBusesData {
  groups: GroupedLikedBuses;
  order: string[]
}

interface GroupedLikedBuses {
  [groupName: string]: BusGroup;
}

interface BusGroup {
  isArchived?: boolean;
  busStops: {
    [busStopCode: string]: string[];
  };
}


// Define the context type
type LikedBusesContextType = {
  groups: GroupedLikedBuses;
  order: string[];
  toggleLike: (groupName: string, busStopCode: string, serviceNo: string) => Promise<void>;
  toggleUnlike: (groupName: string, busStopCode: string, serviceNo: string) => Promise<void>;
  createGroup: (groupName: string) => Promise<void>;
  deleteGroup: (groupName: string) => Promise<void>;
  toggleIsArchived: (groupName: string) => Promise<void>;
  // reorderGroups: (newOrder: string[]) => Promise<void>;
};

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined);

// Provider component
export const LikedBusesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBusesData, setLikedBusesData] = useState<LikedBusesData>({
    groups: { Pinned: {isArchived: false, busStops: {} } },
    order: ["Pinned"]
  });

  // Load liked buses from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBuses = async () => {
      try {
        const storedData = await AsyncStorage.getItem('likedBuses');
        setLikedBusesData(storedData ? JSON.parse(storedData) : { groups: {}, order: [] });
      } catch (error) {
        console.error('Failed to load liked buses:', error);
      }
    };
    loadLikedBuses();
  }, []);

  // Helper function to save to AsyncStorage
  const saveToStorage = async (updatedData: LikedBusesData) => {
    try {
      await AsyncStorage.setItem('likedBuses', JSON.stringify(updatedData));
      setLikedBusesData(updatedData);
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  };

  // Reorder groups
  // const reorderGroups = async (newOrder: string[]) => {
  //   await saveToStorage({ ...likedBusesData, order: newOrder });
  // }

  // Toggle like
  const toggleLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (!likedBusesData.groups[groupName]) return;

    const group = likedBusesData.groups[groupName];
    const busServices = group.busStops[busStopCode] || [];

    if (busServices.includes(serviceNo)) {
      Alert.alert('Already added', `${serviceNo} is already in "${groupName}"`);
      return;
    }

    // for 1 group
    const updatedBusStops = {
      ...group.busStops, // other bus stop codes
      [busStopCode]: [...busServices, serviceNo],
    };

    // for all groups
    const updatedGroups = {
      ...likedBusesData.groups, // other groups
      [groupName]: { ...group, busStops: updatedBusStops },
    };

    await saveToStorage({
      groups: updatedGroups,  // Ensure we update the groups key
      order: likedBusesData.order, // Preserve the order
    });
  };

  // Toggle unlike
  const toggleUnlike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (!likedBusesData.groups[groupName]) return;

    const updatedBusStops = { ...likedBusesData.groups[groupName].busStops };
    updatedBusStops[busStopCode] = updatedBusStops[busStopCode].filter(s => s !== serviceNo);
    
    if (updatedBusStops[busStopCode].length === 0) delete updatedBusStops[busStopCode];

    const updatedGroups = {
      ...likedBusesData.groups,
      [groupName]: { ...likedBusesData.groups[groupName], busStops: updatedBusStops },
    };

    await saveToStorage({
      groups: updatedGroups, // Ensure only `groups` is updated
      order: likedBusesData.order, // Preserve the group order
    });
  };

  // Create a new group
  const createGroup = async (groupName: string) => {
    if (likedBusesData.groups[groupName]) {
      Alert.alert('Duplicated Group', `Group "${groupName}" already exists.`);
      return;
    }

    const updatedGroups = {
      ...likedBusesData.groups,
      [groupName]:{ isArchived: false, busStops: {} },
    };

    await saveToStorage({
      groups: updatedGroups, // Ensure only `groups` is updated
      order: [...likedBusesData.order, groupName], // Preserve the group order
    });
  };

  // Delete a group
  const deleteGroup = async (groupName: string) => {
    if (!likedBusesData.groups[groupName]) return;

    const updatedGroups = { ...likedBusesData.groups };
    delete updatedGroups[groupName];

    await saveToStorage({
      groups: updatedGroups,
      order: likedBusesData.order.filter(name => name !== groupName),
    });
  };

  // Toggle isArchived
    const toggleIsArchived = async (groupName: string) => {
      if (!likedBusesData.groups[groupName]) return;

      const wasArchived = likedBusesData.groups[groupName].isArchived;
      const updatedGroups = {
        ...likedBusesData.groups,
        [groupName]: {
          ...likedBusesData.groups[groupName],
          isArchived: !wasArchived,
        },
      };

      // Update order: Remove if archiving, add to end if unarchiving
      const updatedOrder = wasArchived
        ? [...likedBusesData.order, groupName] // Add back to the end when unarchived
        : likedBusesData.order.filter((name) => name !== groupName); // Remove when archived

      await saveToStorage({
        groups: updatedGroups,
        order: updatedOrder,
      });
    };


  return (
    <LikedBusesContext.Provider value={{ 
      groups: likedBusesData.groups, 
      order: likedBusesData.order, 
      toggleLike, 
      toggleUnlike, 
      createGroup, 
      deleteGroup, 
      toggleIsArchived,
      // reorderGroups
    }}>
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
