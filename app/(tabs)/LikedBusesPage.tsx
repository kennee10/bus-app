import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLikedBuses } from "../../components/context/likedBusesContext";
import LikedBusesBusStopComponent from "../../components/main/LikedBusesBusStopComponent";
import { colors, containerStyles, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBusStopsDetails } from "../../components/hooks/getBusStopsDetails"

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

const LikedBusesPage = () => {
  const { likedBuses, deleteGroup } = useLikedBuses();
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  const [busStopDetails, setBusStopDetails] = useState<{[key: string]: BusStopWithDist}>({});
  const groups = Object.entries(likedBuses || {});

  // Group collapse State
  useEffect(() => {
    const loadCollapsedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('groupCollapseState');
        if (savedState) {
          setCollapsedGroups(JSON.parse(savedState));
        } else {
          const initialState = Object.fromEntries(
            groups.map(([groupName]) => [groupName, true])
          );
          setCollapsedGroups(initialState);
        }
      } catch (error) {
        console.error('Failed to load collapsed state', error);
      }
    };

    loadCollapsedState();
  }, [likedBuses]);

  const toggleGroupCollapse = async (groupName: string) => {
    setCollapsedGroups(prev => {
      const newState = {
        ...prev,
        [groupName]: !prev[groupName]
      };
      
      AsyncStorage.setItem('groupCollapseState', JSON.stringify(newState));
      
      return newState;
    });
  };
  
  // Get bus stop details
  useEffect(() => {
    const fetchBusStopDetails = async () => {
      try {
        // Extract unique bus stop codes from all groups
        const busStopCodes = new Set<string>();
        Object.values(likedBuses || {}).forEach(groupData => {
          Object.keys(groupData).forEach(busStopCode => {
            busStopCodes.add(busStopCode);
          });
        });

        // Only fetch if there are bus stops to fetch
        if (busStopCodes.size > 0) {
          const details = await getBusStopsDetails(Array.from(busStopCodes));
          
          // Convert array to object for easier lookup
          const detailsMap = details.reduce((acc, busStop) => ({
            ...acc,
            [busStop.BusStopCode]: busStop
          }), {});
          
          setBusStopDetails(detailsMap);
        }
      } catch (error) {
        console.error('Failed to fetch bus stop details:', error);
      }
    };

    fetchBusStopDetails();
  }, [likedBuses]);

  const handleDeleteGroup = (groupName: string) => {
      Alert.alert(
        "Delete Group",
        `Are you sure you want to delete "${groupName}"?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteGroup(groupName);
            },
            style: "destructive"
          }
        ]
      );
    };

  return (
    <View style={containerStyles.pageContainer}>
      <View style={[containerStyles.innerPageContainer, {marginTop: scale(10)}]}>
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't liked any buses yet!</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={([groupName]) => groupName}
          renderItem={({ item: [groupName, groupData] }) => (
            <View style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <TouchableOpacity 
                  style={styles.groupTitleContainer} 
                  onPress={() => toggleGroupCollapse(groupName)}
                >
                  <View style={styles.arrowContainer}>
                    <Ionicons 
                      name={collapsedGroups[groupName] ? "chevron-forward" : "chevron-down"}
                      size={scale(18)} 
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.groupTitle}>{groupName}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGroup(groupName)}
                >
                  <Ionicons 
                    name="trash-outline" 
                    size={scale(18)} 
                    color={colors.onSurfaceSecondary2}
                  />
                </TouchableOpacity>
              </View>
              
              

            
              {!collapsedGroups[groupName] && (
                Object.keys(groupData).length > 0 ? (
                  Object.entries(groupData).map(([busStopCode, likedServices]) => (
                    <LikedBusesBusStopComponent
                      key={busStopCode}
                      busStopCode={busStopCode}
                      groupName={groupName}
                      likedServices={likedServices}
                      busStopDetails={busStopDetails[busStopCode]}
                    />
                  ))
                ) : (
                  <View style={styles.noLikedBusesInGroupTextWrapper}>
                    <Text style={styles.noLikedBusesInGroupText}>
                      No liked buses in this group
                    </Text>
                  </View>
                  
                )
              )}

            </View>
          )}
        />
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: scale(15),
    marginHorizontal: scale(20),
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
  },
  groupContainer: {
    marginBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface3,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: 'center',
    padding: scale(10),
  },
  groupTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: "center",
    paddingLeft: 0,
  },
  deleteButton: {
  },
  arrowContainer: {
    flex: 1,
    alignItems:"center",
    // backgroundColor: 'red'
  },
  groupTitle: {
    flex: 10,
    fontSize: scale(15),
    marginLeft: scale(6),
    fontFamily: font.bold,
    color: colors.primary,
    // backgroundColor: 'yellow'
  },
  noLikedBusesInGroupTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(5),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  noLikedBusesInGroupText: {
    flex: 1,
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
  },
});

export default LikedBusesPage;