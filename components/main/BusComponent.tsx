import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, Alert } from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { useLikedBuses } from "../context/likedBusesContext";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

type NextBusInfo = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
  lastUpdated?: Date;
};

type BusComponentProps = {
  busNumber: string;
  busStopCode: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
  onHeartToggle: (
    groupName: string,
    busStopCode: string,
    serviceNo: string
  ) => Promise<void>;
};

const BusComponent: React.FC<BusComponentProps> = (props) => {
  const { likedBuses, toggleLike, createGroup, deleteGroup } = useLikedBuses();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const groupNames = Object.keys(likedBuses);

  const handleHeartPress = () => {
    setModalVisible(true);
  };

  const handleGroupSelect = async (groupName: string) => {
    await toggleLike(groupName, props.busStopCode, props.busNumber);
    setModalVisible(false);
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      await createGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

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

  const renderGroupItem = ({ item }: { item: string }) => (
    <View style={styles.groupItem}>
      <TouchableOpacity
        style={styles.groupItemContent}
        onPress={() => handleGroupSelect(item)}
      >
        <Text style={styles.groupText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGroup(item)}
      >
        <Ionicons 
          name="trash-outline" 
          size={scale(15)} 
          color={colors.onSurfaceSecondary2}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Bus Number */}
      <View style={styles.busNumberWrapper}>
        <Text style={styles.busNumber} adjustsFontSizeToFit numberOfLines={1}>
          {props.busNumber}
        </Text>
      </View>

      {/* Timings Wrapper */}
      <View style={styles.busInfoWrapper}>
        {props.nextBuses.map((arrival, index) => (
          <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
        ))}
      </View>

      {/* Like Button */}
      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity onPress={handleHeartPress}>
          <Ionicons
            name="heart-outline"
            color={props.isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
            size={scale(18)}
          />
        </TouchableOpacity>
      </View>

      {/* Modal for Group Selection */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>Select a Group</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" style={styles.modalCrossIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {groupNames.length > 0 ? (
                <FlatList
                  data={groupNames}
                  keyExtractor={(item) => item}
                  renderItem={renderGroupItem}
                  style={styles.flatList}
                  ItemSeparatorComponent={() => <View style={{height: scale(7)}}/>}
                />
              ) : (
                <Text style={[containerStyles.globalInfoTextMessage, styles.noGroups]}>You haven't created a group</Text>
              )
              }
              

              <View style={styles.modalFooter}>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  placeholder="Create new group (eg. Home -> Work)"
                  placeholderTextColor={colors.onSurfaceSecondary2}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  onSubmitEditing={handleCreateGroup}
                />

                <TouchableOpacity
                  style={styles.createButton} 
                  onPress={handleCreateGroup}
                >
                  <FontAwesome6 name="check" color={colors.onSurface} size={scale(14)}/>
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: scale(8),
    paddingRight: scale(8),
    margin: scale(2.5),
    marginLeft: scale(5),
    marginRight: scale(5),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  busNumberWrapper: {
    flex: 2,
    alignItems: "center",
    marginRight: scale(16),
  },
  busNumber: {
    fontSize: scale(19),
    fontWeight: "bold",
    color: colors.secondary,
  },
  busInfoWrapper: {
    flex: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: scale(14),
  },
  likeButtonWrapper: {
    flex: 1,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    // maxHeight: "80%",
    backgroundColor: colors.surface3,
    borderRadius: scale(6),
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    padding: scale(10),
    opacity: 0.99,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(5),
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: scale(15),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  modalCrossIcon: {
    fontSize: scale(25),
    color: colors.secondary2,
  },
  modalBody: {
    padding: scale(5),
    maxHeight: scale(440),
  },
  noGroups: {
    paddingTop: scale(20),
    paddingBottom: scale(20),
    fontFamily: font.semiBold,
    fontSize: scale(13),
  },
  flatList: {
    width: "100%",
    maxHeight: scale(335),
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: scale(4),
    padding: scale(10),
    width: "100%",
  },
  groupItemContent: {
    flex: 1,
  },
  groupText: {
    fontSize: scale(14),
    color: colors.primary,
    fontFamily: font.semiBold,
  },
  deleteButton: {
  },
  modalFooter: {
    flexDirection: "row",
    marginTop: scale(20),
  },
  input: {
    flex: 10,
    padding: scale(10),
    marginRight: scale(5),
    borderWidth: 1,
    borderColor: colors.onSurfaceSecondary2,
    borderRadius: scale(4),
    color: colors.onSurface,
    fontFamily: font.medium,
  },
  createButton: {
    flex: 1.5,
    backgroundColor: colors.primary,
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BusComponent;