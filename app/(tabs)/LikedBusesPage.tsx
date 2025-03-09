import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLikedBuses } from "../../components/context/likedBusesContext";
import LikedBusesBusStopComponent from "../../components/main/LikedBusesBusStopComponent";
import { colors, containerStyles, font, navigationBarHeight } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBusStopsDetails } from "../../components/hooks/getBusStopsDetails";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";

type BusStopWithDist = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
};

type BottomModalMenuProps = {
  isVisible: boolean;
  isArchived: boolean;
  groupName: string;
  onClose: () => void;
  onArchivePress: () => void;
  onRenamePress: () => void;
  onDeletePress: () => void;
};

type RenameModalProps = {
  isVisible: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
};

// Memoized modal components to prevent unnecessary re-renders
const BottomModalMenu: React.FC<BottomModalMenuProps> = memo(({
  isVisible,
  isArchived,
  groupName,
  onClose,
  onArchivePress,
  onRenamePress,
  onDeletePress,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
        <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
            <View style={styles.bottomModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{groupName}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalDivider} />
              
              <TouchableOpacity onPress={onArchivePress} style={styles.modalMenuItem}>
                <Ionicons
                  name={isArchived ? "eye-off" : "eye"}
                  size={scale(18)}
                  color={colors.onSurfaceSecondary}
                  style={styles.modalMenuIcon}
                />
                <Text style={styles.modalMenuItemText}>
                  {isArchived ? "Unarchive" : "Archive"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onRenamePress} style={styles.modalMenuItem}>
                <Ionicons
                  name="create-outline"
                  size={scale(18)}
                  color={colors.onSurfaceSecondary}
                  style={styles.modalMenuIcon}
                />
                <Text style={styles.modalMenuItemText}>Rename</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onDeletePress} style={styles.modalMenuItem}>
                <Ionicons
                  name="trash-outline"
                  size={scale(18)}
                  color={colors.accent3}
                  style={styles.modalMenuIcon}
                />
                <Text style={[styles.modalMenuItemText, {color: colors.accent3}]}>Delete</Text>
              </TouchableOpacity>
            </View>
        </SafeAreaView>
    </Modal>
  );
});

const RenameBottomModal: React.FC<RenameModalProps> = memo(({
  isVisible,
  initialName,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [inputRef, setInputRef] = useState<TextInput | null>(null);

  // Reset the name state when modal becomes visible and focus the input
  useEffect(() => {
    if (isVisible) {
      setName(initialName);
      // Use a small timeout to ensure modal is fully visible before focusing
      const timer = setTimeout(() => {
        if (inputRef) {
          inputRef.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, initialName, inputRef]);

  const handleSave = useCallback(() => {
    if (name.trim()) {
      // Keyboard.dismiss();
      onSave(name.trim());
    }
  }, [name, onSave]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
          <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>
              <View style={styles.bottomModalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Rename Group</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalDivider} />
                
                <TextInput
                  ref={(ref) => setInputRef(ref)}
                  style={styles.modalTextInput}
                  multiline={true}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter new name"
                  placeholderTextColor={colors.onSurfaceSecondary2}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
                
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleSave}
                    style={[styles.modalButton, styles.primaryButton]}
                    disabled={!name.trim()}
                  >
                    <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
});

// Memoized BusStopComponent to prevent re-renders
const MemoizedLikedBusesBusStopComponent = memo(LikedBusesBusStopComponent);

// Toast helper function
const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

// Memoized GroupItem component
const GroupItem = memo(({ 
  groupName, 
  busStopDetails, 
  collapsedGroups, 
  toggleGroupCollapse,
  toggleIsArchived,
  renameGroup,
  deleteGroup
}: { 
  groupName: string;
  busStopDetails: { [key: string]: BusStopWithDist };
  collapsedGroups: { [key: string]: boolean };
  toggleGroupCollapse: (groupName: string) => void;
  toggleIsArchived: (groupName: string) => Promise<void>;
  renameGroup: (oldName: string, newName: string) => Promise<void>;
  deleteGroup: (groupName: string) => Promise<void>;
}) => {
  const { groups } = useLikedBuses();
  const groupData = groups[groupName];
  const [menuVisible, setMenuVisible] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const toggleMenu = useCallback(() => setMenuVisible((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleRename = useCallback(() => {
    closeMenu();
    setIsRenaming(true);
  }, [closeMenu]);

  const handleSaveRename = useCallback(async (newName: string) => {
    try {
      await renameGroup(groupName, newName);
      
    } catch (error) {
      console.error("Failed to rename group:", error);
    } finally {
      setIsRenaming(false);
    }
  }, [groupName, renameGroup]);

  const handleArchiveToggle = useCallback(async () => {
    try {
      await toggleIsArchived(groupName);
      showToast(groupData?.isArchived ? `"${groupName}" unarchived` : `"${groupName}" archived`);
    } catch (error) {
      console.error("Failed to toggle archive status:", error);
    } finally {
      closeMenu();
    }
  }, [closeMenu, groupData?.isArchived, groupName, toggleIsArchived]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Group", `Delete "${groupName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteGroup(groupName);
            showToast(`"${groupName}" deleted`);
          } catch (error) {
            console.error("Failed to delete group:", error);
          }
        },
        style: "destructive",
      },
    ]);
    closeMenu();
  }, [closeMenu, deleteGroup, groupName]);

  const handleToggleCollapse = useCallback(() => {
    toggleGroupCollapse(groupName);
  }, [groupName, toggleGroupCollapse]);

  return (
    <View style={styles.groupContainer}>
      <View style={styles.groupHeader}>
        {/* COLLAPSE */}
        <TouchableOpacity
          style={styles.groupTitleContainer}
          onPress={handleToggleCollapse}
        >
          <View style={styles.arrowContainer}>
            <Ionicons
              name={collapsedGroups[groupName] ? "chevron-forward" : "chevron-down"}
              size={scale(18)}
              color={colors.primary}
            />
          </View>
          {/* GROUP NAME */}
          <Text style={styles.groupTitle}>{groupName}</Text>
          
        </TouchableOpacity>

        {/* MENU */}
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={scale(18)}
            color={colors.onSurfaceSecondary2}
          />
        </TouchableOpacity>
        
        
        {/* Bottom slide up modal menu */}
        <BottomModalMenu
          isVisible={menuVisible}
          isArchived={groupData?.isArchived ?? false}
          groupName={groupName}
          onClose={closeMenu}
          onArchivePress={handleArchiveToggle}
          onRenamePress={handleRename}
          onDeletePress={handleDelete}
        />

        {/* Bottom slide up rename modal */}
        <RenameBottomModal
          isVisible={isRenaming}
          initialName={groupName}
          onClose={() => setIsRenaming(false)}
          onSave={handleSaveRename}
        />
      </View>
      {!collapsedGroups[groupName] &&
        (Object.keys(groupData?.busStops || {}).length > 0 ? (
          Object.entries(groupData?.busStops || {}).map(([busStopCode, likedServices]) => (
            <MemoizedLikedBusesBusStopComponent
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
        ))}
    </View>
  );
});

const LikedBusesPage = () => {
  const { groups, order, deleteGroup, toggleIsArchived, renameGroup } = useLikedBuses();
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const [busStopDetails, setBusStopDetails] = useState<{ [key: string]: BusStopWithDist }>({});
  const [archivedModalVisible, setArchivedModalVisible] = useState(false);
  
  // Load collapsed state from storage
  useEffect(() => {
    const loadCollapsedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("groupCollapseState");
        if (savedState) {
          setCollapsedGroups(JSON.parse(savedState));
        } else {
          // Initialize with all groups collapsed
          const initialState = Object.fromEntries(
            order.map((name) => [name, true])
          );
          setCollapsedGroups(initialState);
          AsyncStorage.setItem("groupCollapseState", JSON.stringify(initialState));
        }
      } catch (error) {
        console.error("Failed to load collapsed state", error);
      }
    };
    loadCollapsedState();
  }, [order]);

  // Memoized toggle function to prevent re-renders
  const toggleGroupCollapse = useCallback(async (groupName: string) => {
    setCollapsedGroups((prev) => {
      const newState = { ...prev, [groupName]: !prev[groupName] };
      AsyncStorage.setItem("groupCollapseState", JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Fetch bus stop details 
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
          const detailsMap = details.reduce(
            (acc, busStop) => ({
              ...acc,
              [busStop.BusStopCode]: busStop,
            }),
            {}
          );
          setBusStopDetails(detailsMap);
        }
      } catch (error) {
        console.error("Failed to fetch bus stop details:", error);
      }
    };
    fetchBusStopDetails();
  }, [groups]);

  // Memoized list of unarchived groups
  const unarchivedGroupsOrder = useMemo(() => 
    order.filter((groupName) => !groups[groupName]?.isArchived),
    [groups, order]
  );

  // Memoized list of archived groups
  const archivedGroupsOrder = useMemo(
    () => Object.keys(groups).filter(groupName => groups[groupName]?.isArchived),
    [groups]  // Only depend on groups, not order
  );

  // Memoized render item function for groups
  const renderGroupItem = useCallback(({ item }: { item: string }) => (
    <GroupItem 
      groupName={item} 
      busStopDetails={busStopDetails}
      collapsedGroups={collapsedGroups}
      toggleGroupCollapse={toggleGroupCollapse}
      toggleIsArchived={toggleIsArchived}
      renameGroup={renameGroup}
      deleteGroup={deleteGroup}
    />
  ), [busStopDetails, collapsedGroups, toggleGroupCollapse, toggleIsArchived, renameGroup, deleteGroup]);

  // Close modal handler
  const closeArchivedModal = useCallback(() => {
    setArchivedModalVisible(false);
  }, []);

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={containerStyles.pageContainer}>
        <View style={[containerStyles.innerPageContainer, { marginTop: scale(10) }]}>
          {unarchivedGroupsOrder.length === 0 ? (
            <View style={styles.emptyContainer}>
              {archivedGroupsOrder.length === 0 ? (
                <Text style={containerStyles.globalInfoTextMessage}>
                  You haven't liked any buses
                </Text>
              ) : (
                <Text style={containerStyles.globalInfoTextMessage}>
                  Groups are in archive
                </Text>
              )}
              
            </View>
          ) : (
            <DraggableFlatList
              data={unarchivedGroupsOrder}
              keyExtractor={(item) => item}
              renderItem={renderGroupItem}
              contentContainerStyle={{ paddingBottom: navigationBarHeight + scale(10)}}
              keyboardShouldPersistTaps="handled"
              
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.archivedGroupsButton}
          onPress={() => setArchivedModalVisible(true)}
        >
          <Ionicons
            name="eye-off"
            size={scale(24)}
            color={colors.onSurfaceSecondary2}
          />
        </TouchableOpacity>

        {/* Archived Groups Modal */}
        <Modal
          visible={archivedModalVisible}
          animationType="fade"
          transparent
          onRequestClose={closeArchivedModal}
        >
            <View style={styles.modalOverlay}>
              {/* Backdrop that closes the modal */}
              <TouchableWithoutFeedback onPress={closeArchivedModal}>
                <View style={StyleSheet.absoluteFillObject} />
              </TouchableWithoutFeedback>

                <View style={[styles.bottomModalContainer, styles.archivedModalContainer]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Archived Groups</Text>
                    <TouchableOpacity onPress={closeArchivedModal} style={styles.closeButton}>
                      <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalDivider} />
                  
                  {archivedGroupsOrder.length === 0 ? (
                    <View style={styles.emptyContainerArchived}>
                      <Text style={[containerStyles.globalInfoTextMessage]}>
                        No archived groups
                      </Text>
                    </View>
                      
                  ) : (
                    <DraggableFlatList
                      data={archivedGroupsOrder}
                      keyExtractor={(item) => item}
                      renderItem={renderGroupItem}
                      keyboardShouldPersistTaps="always"
                      contentContainerStyle={{ paddingBottom: navigationBarHeight + scale(10)}}
                    />
                  )}
                </View>
            </View>
        </Modal>
      </View>
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainerArchived: {
    height: scale(100),
    justifyContent: "center",
  },
  groupContainer: {
    marginBottom: scale(7),
    borderRadius: scale(4),
    overflow: "hidden",
    backgroundColor: colors.surface3,
    borderWidth: scale(0.5),
    borderColor: colors.borderToPress2,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add this
  },
  groupTitleContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    padding: scale(10),
    paddingRight: scale(6),
  },
  arrowContainer: {
    marginRight: scale(6),
    justifyContent: "center",
  },
  groupTitle: {
    flex: 1,
    fontSize: scale(15),
    marginRight: scale(6),
    fontFamily: font.bold,
    color: colors.primary,
    width: "100%",
  },
  menuButton: {
    padding: scale(4),
    marginRight: scale(6),
  },
  noLikedBusesInGroupTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(5),
    paddingVertical: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    elevation: 2,
  },
  noLikedBusesInGroupText: {
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlayBackgroundColor,
    justifyContent: "flex-end", // Position at bottom
  },
  bottomModalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    padding: scale(10),
    elevation: 5,
    maxHeight: '80%',
  },
  archivedModalContainer: {
    maxHeight: "80%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(6),
  },
  modalTitle: {
    fontSize: scale(16),
    fontFamily: font.bold,
    color: colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: scale(4),
  },
  modalDivider: {
    height: scale(1),
    backgroundColor: colors.borderToPress,
    marginVertical: scale(10),
  },
  modalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(10),
    marginBottom: scale(5),
    borderRadius: scale(4),
    backgroundColor: colors.surface3,
    borderWidth: scale(0.5),
    borderColor: colors.borderToPress,
  },
  modalMenuIcon: {
    marginRight: scale(8),
    paddingHorizontal: scale(6),
    textAlign: "center",
  },
  modalMenuItemText: {
    fontSize: scale(14.5),
    fontFamily: font.medium,
    color: colors.onSurfaceSecondary,
  },
  // Text input and button styles for rename modal
  modalTextInput: {
    fontSize: scale(14.5),
    fontFamily: font.medium,
    color: colors.primary,
    borderWidth: scale(1),
    borderColor: colors.borderToPress,
    borderRadius: scale(8),
    padding: scale(12),
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: scale(10),
  },
  modalButton: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(4),
    marginLeft: scale(2),
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: scale(14),
    fontFamily: font.semiBold,
    color: colors.primary,
  },
  primaryButtonText: {
    color: colors.surface3,
  },
});

export default LikedBusesPage;