import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLikedBuses } from "../../components/context/likedBusesContext";
import LikedBusesBusStopComponent from "../../components/main/LikedBusesBusStopComponent";
import { colors, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikedBusesPage = () => {
  const { likedBuses } = useLikedBuses();
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});

  const groups = Object.entries(likedBuses || {});

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

  return (
    <View style={styles.container}>
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
              <TouchableOpacity 
                style={styles.groupTitleContainer} 
                onPress={() => toggleGroupCollapse(groupName)}
              >
                <Text style={styles.groupTitle}>{groupName}</Text>
                <View style={styles.arrowContainer}>
                  <Ionicons 
                    name={collapsedGroups[groupName] ? "chevron-down" : "chevron-up"} 
                    size={24} 
                    color={colors.primary}
                  />
                </View>
                
              </TouchableOpacity>

              {!collapsedGroups[groupName] && Object.entries(groupData).map(([busStopCode, likedServices]) => (
                <LikedBusesBusStopComponent
                  key={busStopCode}
                  busStopCode={busStopCode}
                  groupName={groupName}
                  likedServices={likedServices}
                />
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
    marginHorizontal: 20,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    marginBottom: scale(12),
    alignItems: "center",
  },
  groupTitle: {
    flex: 10,
    fontSize: scale(15),
    padding: scale(5),
    fontFamily: font.bold,
    color: colors.primary,
    textTransform: "capitalize",
  },
  arrowContainer: {
    flex: 1,
    alignItems:"center",
  },
});

export default LikedBusesPage;
