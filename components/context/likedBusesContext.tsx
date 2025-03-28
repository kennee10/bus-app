import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid, } from 'react-native';


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
  createGroupAndLike: (groupName: string, busStopCode: string, serviceNo: string) => Promise<void>;
  toggleIsArchived: (groupName: string) => Promise<void>;
  renameGroup: (groupName: string, newGroupName: string) => Promise<void>;
};

// Create Context
const LikedBusesContext = createContext<LikedBusesContextType | undefined>(undefined);

// Provider component
export const LikedBusesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedBusesData, setLikedBusesData] = useState<LikedBusesData>({
    groups: { Pinned: {isArchived: false, busStops: {} } },
    order: ["Pinned"]
  });

  // Toast helper function
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  // Load liked buses from AsyncStorage on initial render
  useEffect(() => {
    const loadLikedBuses = async () => {
      try {
        const storedData = await AsyncStorage.getItem('likedBuses');
        setLikedBusesData(storedData ? JSON.parse(storedData) : { 
          groups: { Pinned: {isArchived: false, busStops: {} } }, 
          order: ["Pinned"] 
        });
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

  // Toggle like
  const toggleLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (!likedBusesData.groups[groupName]) return;

    const group = likedBusesData.groups[groupName];
    const busServices = group.busStops[busStopCode] || [];

    if (busServices.includes(serviceNo)) {
      Alert.alert('Already added', `${serviceNo} is already in "${groupName}"`);
      return;
    }

    showToast(`Bus '${serviceNo}' liked`);
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

    // showToast(`bus unliked`);
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
    showToast(`group created`);
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

  const createGroupAndLike = async (groupName: string, busStopCode: string, serviceNo: string) => {
    if (likedBusesData.groups[groupName]) {
      Alert.alert('Duplicated Group', `Group "${groupName}" already exists.`);
      return;
    }
    
    showToast(`added to "${groupName}"`);
    
    const updatedGroups = {
      ...likedBusesData.groups,
      [groupName]: { isArchived: false, busStops: { [busStopCode]: [serviceNo] } },
    };
  
    await saveToStorage({
      groups: updatedGroups,
      order: [...likedBusesData.order, groupName],
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

  // Rename group
  const renameGroup = async (groupName: string, newGroupName: string) => {
    // Check if the original group exists
    if (!likedBusesData.groups[groupName]) {
      Alert.alert("Error", "The group you are trying to rename does not exist.");
      return;
    }
    // Validate new name
    if (!newGroupName || newGroupName.trim() === "") {
      Alert.alert("Invalid Name", "Group name cannot be empty.");
      return;
    }
    if (groupName === newGroupName) {
      Alert.alert("Same Group Name", "Same group name submitted.");
      return;
    }
    // Check if the new name is already taken
    if (likedBusesData.groups[newGroupName]) {
      Alert.alert("Duplicated Group", `Group "${newGroupName}" already exists.`);
      return;
    }
    
    showToast(`"${newGroupName}" renamed`);
    // Create updated groups object
    const updatedGroups = { ...likedBusesData.groups };
    const groupData = updatedGroups[groupName];
    delete updatedGroups[groupName];
    updatedGroups[newGroupName] = groupData;
    
    // Update the order array using likedBusesData.order
    const updatedOrder = likedBusesData.order.map(name => (name === groupName ? newGroupName : name));
    
    const updatedLikedBusesData: LikedBusesData = {
      groups: updatedGroups,
      order: updatedOrder,
    };

    await saveToStorage(updatedLikedBusesData);
  };
  


  return (
    <LikedBusesContext.Provider value={{ 
      groups: likedBusesData.groups, 
      order: likedBusesData.order, 
      toggleLike, 
      toggleUnlike, 
      createGroup, 
      deleteGroup,
      createGroupAndLike,
      toggleIsArchived,
      renameGroup
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
