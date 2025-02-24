import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLikedBuses } from "../../components/context/likedBusesContext";
import LikedBusesBusStopComponent from "../../components/main/LikedBusesBusStopComponent";
import { colors, containerStyles, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBusStopsDetails } from "../../components/hooks/getBusStopsDetails";
import DraggableFlatList, {
  DragEndParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

const LikedBusesPage = () => {
  const { groups, order, deleteGroup, toggleIsArchived, reorderGroups } = useLikedBuses();
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const [busStopDetails, setBusStopDetails] = useState<{ [key: string]: BusStopWithDist }>({});
  const [archivedModalVisible, setArchivedModalVisible] = useState(false);

  const unarchivedGroupsOrder = order.filter(
    groupName => !groups[groupName]?.isArchived
  );

  useEffect(() => {
    const loadCollapsedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("groupCollapseState");
        if (savedState) {
          setCollapsedGroups(JSON.parse(savedState));
        } else {
          const initialState = Object.fromEntries(
            unarchivedGroupsOrder.map(groupName => [groupName, true])
          );
          setCollapsedGroups(initialState);
        }
      } catch (error) {
        console.error("Failed to load collapsed state", error);
      }
    };
    loadCollapsedState();
  }, [groups, order]);

  const toggleGroupCollapse = async (groupName: string) => {
    setCollapsedGroups((prev) => {
      const newState = { ...prev, [groupName]: !prev[groupName] };
      AsyncStorage.setItem("groupCollapseState", JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    const fetchBusStopDetails = async () => {
      try {
        const busStopCodes = new Set<string>();
        Object.values(groups || {}).forEach((group) => {
          Object.keys(group.busStops || {}).forEach((busStopCode) => {
            busStopCodes.add(busStopCode);
          });
        });
        if (busStopCodes.size > 0) {
          const details = await getBusStopsDetails(Array.from(busStopCodes));
          const detailsMap = details.reduce((acc, busStop) => ({
            ...acc,
            [busStop.BusStopCode]: busStop,
          }), {});
          setBusStopDetails(detailsMap);
        }
      } catch (error) {
        console.error("Failed to fetch bus stop details:", error);
      }
    };
    fetchBusStopDetails();
  }, [groups]);

  const handleDragEnd = ({ data }: DragEndParams<string>) => {
    const archivedGroups = order.filter(groupName => groups[groupName]?.isArchived);
    const newOrder = [...data, ...archivedGroups];
    reorderGroups(newOrder);
  };

  const handleDeleteGroup = (groupName: string) => {
    Alert.alert("Delete Group", `Delete "${groupName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => await deleteGroup(groupName), style: "destructive" },
    ]);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: {
    item: string;
    drag: () => void;
    isActive: boolean;
  }) => {
    const groupData = groups[item];
    return (
      <View style={{ opacity: isActive ? 0.5 : 1 }}>
        <View style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
              <Ionicons name="reorder-three-outline" size={scale(24)} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupTitleContainer}
              onPress={() => toggleGroupCollapse(item)}
            >
              <View style={styles.arrowContainer}>
                <Ionicons
                  name={collapsedGroups[item] ? "chevron-forward" : "chevron-down"}
                  size={scale(18)}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.groupTitle}>{item}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.archiveButton}
              onPress={() => toggleIsArchived(item)}
            >
              <Ionicons
                name={groupData?.isArchived ? "eye-off" : "eye"}
                size={scale(18)}
                color={colors.onSurfaceSecondary2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGroup(item)}
            >
              <Ionicons
                name="trash-outline"
                size={scale(18)}
                color={colors.onSurfaceSecondary2}
              />
            </TouchableOpacity>
          </View>

          {!collapsedGroups[item] &&
            (Object.keys(groupData?.busStops || {}).length > 0 ? (
              Object.entries(groupData?.busStops || {}).map(([busStopCode, likedServices]) => (
                <LikedBusesBusStopComponent
                  key={busStopCode}
                  busStopCode={busStopCode}
                  groupName={item}
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
            ))}
        </View>
      </View>
    );
  };

  return (
    <View style={containerStyles.pageContainer}>
      <View style={[containerStyles.innerPageContainer, { marginTop: scale(10) }]}>
        {unarchivedGroupsOrder.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={containerStyles.globalInfoTextMessage}>
              You haven't liked any buses
            </Text>
          </View>
        ) : (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <DraggableFlatList
              data={unarchivedGroupsOrder}
              keyExtractor={(item) => item}
              renderItem={renderItem}
              onDragEnd={handleDragEnd}
              activationDistance={20}
              contentContainerStyle={{ paddingBottom: scale(20) }}
            />
          </GestureHandlerRootView>
        )}
      </View>

      <TouchableOpacity
        style={styles.archivedGroupsButton}
        onPress={() => setArchivedModalVisible(true)}
      >
        <Ionicons name="eye-off" size={scale(24)} color={colors.onSurfaceSecondary2} />
      </TouchableOpacity>

      <Modal
        visible={archivedModalVisible}
        animationType="fade"
        onRequestClose={() => setArchivedModalVisible(false)}
      >
        <View style={containerStyles.pageContainer}>
          <View style={[containerStyles.innerPageContainer, { marginTop: scale(10) }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalBackButton}
                onPress={() => setArchivedModalVisible(false)}
              >
                <Ionicons name="arrow-back" style={styles.modalBackIcon}/>
              </TouchableOpacity>
              <Text style={styles.modalHeaderText}></Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setArchivedModalVisible(false)}
              >
                <Ionicons name="close" size={scale(15)}/>
              </TouchableOpacity>
            </View>

            {Object.keys(groups).filter(groupName => groups[groupName]?.isArchived).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={containerStyles.globalInfoTextMessage}>No archived groups</Text>
              </View>
            ) : (
              <FlatList
                data={Object.keys(groups).filter(groupName => groups[groupName]?.isArchived)}
                keyExtractor={(groupName) => groupName}
                renderItem={({ item }) => {
                  const groupData = groups[item];
                  return (
                    <View style={styles.groupContainer}>
                      <View style={styles.groupHeader}>
                        <TouchableOpacity
                          style={styles.groupTitleContainer}
                          onPress={() => toggleGroupCollapse(item)}
                        >
                          <View style={styles.arrowContainer}>
                            <Ionicons
                              name={collapsedGroups[item] ? "chevron-forward" : "chevron-down"}
                              size={scale(18)}
                              color={colors.primary}
                            />
                          </View>
                          <Text style={styles.groupTitle}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.archiveButton}
                          onPress={() => toggleIsArchived(item)}
                        >
                          <Ionicons
                            name={groupData?.isArchived ? "eye-off" : "eye"}
                            size={scale(18)}
                            color={colors.onSurfaceSecondary2}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteGroup(item)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={scale(18)}
                            color={colors.onSurfaceSecondary2}
                          />
                        </TouchableOpacity>
                      </View>
                      {!collapsedGroups[item] &&
                        (Object.keys(groupData?.busStops || {}).length > 0 ? (
                          Object.entries(groupData?.busStops || {}).map(([busStopCode, likedServices]) => (
                            <LikedBusesBusStopComponent
                              key={busStopCode}
                              busStopCode={busStopCode}
                              groupName={item}
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
                        ))}
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupContainer: {
    marginBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface3,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: scale(10),
  },
  dragHandle: {
    padding: scale(10),
    marginRight: scale(5),
  },
  groupTitleContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    padding: scale(10),
  },
  archiveButton: {
    overflow: "hidden",
    padding: scale(6),
    marginRight: scale(6),
  },
  deleteButton: {
    overflow: "hidden",
    padding: scale(6),
    paddingRight: 0,
  },
  arrowContainer: {
    flex: 1,
    alignItems: "center",
  },
  groupTitle: {
    flex: 10,
    fontSize: scale(15),
    marginLeft: scale(6),
    fontFamily: font.bold,
    color: colors.primary,
  },
  noLikedBusesInGroupTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(5),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
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
  archivedGroupsButton: {
    position: "absolute",
    bottom: scale(20),
    right: scale(20),
    backgroundColor: colors.surface3,
    padding: scale(10),
    borderRadius: scale(30),
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(10),
    marginHorizontal: scale(5),
  },
  modalHeaderText: {
    flex: 1,
  },
  modalCloseButton: {
    backgroundColor: colors.secondary,
    padding: scale(4),
    borderRadius: scale(30),
    elevation: 5,
  },
  modalBackButton: {
    elevation: 5,
  },
  modalBackIcon: {
    color: colors.secondary2,
    fontSize: scale(20),
  }
});

export default LikedBusesPage;