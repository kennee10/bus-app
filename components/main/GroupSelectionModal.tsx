import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLikedBuses } from "../context/likedBusesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '../../assets/styles/ThemeContext';

type GroupSelectionModalProps = {
  busNumber: string;
  busStopCode: string;
  isVisible: boolean;
  onClose: () => void;
};

// Create a new component for the Create Group modal
type CreateGroupModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (groupName: string) => void;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputRef, setInputRef] = useState<TextInput | null>(null);
  const { colors, font, containerStyles } = useTheme();

  // Focus the input when modal becomes visible
  React.useEffect(() => {
    if (isVisible) {
      setInputValue("");
      // Use a small timeout to ensure modal is fully visible before focusing
      const timer = setTimeout(() => {
        if (inputRef) {
          inputRef.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, inputRef]);

  const handleSave = useCallback(() => {
    if (inputValue.trim()) {
      onSave(inputValue.trim());
      setInputValue("");
    }
  }, [inputValue, onSave]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlayBackgroundColor,
      justifyContent: "flex-end", // Position at bottom
    },
    bottomModalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 10,
      elevation: 5,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 6,
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: font.bold,
      color: colors.primary,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    modalDivider: {
      height: 1,
      backgroundColor: colors.borderToPress,
      marginVertical: 10,
    },
    modalBody: {
      maxHeight: "80%",
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    emptyText: {
      fontFamily: font.medium,
      fontSize: 14,
      color: colors.onSurfaceSecondary,
      textAlign: "center",
    },
    flatList: {
      width: "100%",
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface3,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderToPress2,
    },
    groupItemContent: {
      flex: 1,
      padding: 10,
    },
    groupItemText: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: font.semiBold,
    },
    groupItemIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    archiveIcon: {
      marginRight: 4,
    },
    deleteButton: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    separator: {
      height: 5,
    },
    createGroupButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    createGroupButtonText: {
      fontSize: 14,
      fontFamily: font.semiBold,
      color: colors.surface3,
    },
    disabledButton: {
      backgroundColor: colors.onSurfaceSecondary2,
      opacity: 0.7,
    },
    // Styles for the new Create Group modal
    modalTextInput: {
      fontSize: 14,
      fontFamily: font.medium,
      color: colors.primary,
      borderWidth: 1,
      borderColor: colors.borderToPress,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginLeft: 8,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 14,
      fontFamily: font.semiBold,
      color: colors.primary,
    },
    primaryButtonText: {
      color: colors.surface3,
    },
  });

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
                  <Text style={styles.modalTitle}>Create New Group</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalDivider} />
                
                <TextInput
                  ref={(ref) => setInputRef(ref)}
                  style={styles.modalTextInput}
                  multiline={true}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Enter group name (eg. Home → Work)"
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
                    style={[styles.modalButton, styles.primaryButton, !inputValue.trim() && styles.disabledButton]}
                    disabled={!inputValue.trim()}
                  >
                    <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const GroupSelectionModal: React.FC<GroupSelectionModalProps> = ({
  busNumber,
  busStopCode,
  isVisible,
  onClose,
}) => {
  const { groups, order, toggleLike, createGroupAndLike, deleteGroup } = useLikedBuses();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { colors, font, containerStyles } = useTheme();

  const handleCreateGroup = useCallback(async (groupName: string) => {
    if (groupName) {
      await createGroupAndLike(groupName, busStopCode, busNumber);
      setCreateModalVisible(false);
    }
  }, [busNumber, busStopCode, createGroupAndLike]);

  const handleDeleteGroup = useCallback((groupName: string) => {
    Alert.alert("Delete Group", `Delete "${groupName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => await deleteGroup(groupName),
        style: "destructive",
      },
    ]);
  }, [deleteGroup]);

  const handleToggleLike = useCallback((groupName: string) => {
    toggleLike(groupName, busStopCode, busNumber);
    onClose();
  }, [busNumber, busStopCode, onClose, toggleLike]);

  // Filter unarchived and archived groups
  const unarchivedGroups = order;
  const archivedGroups = Object.keys(groups).filter(
    groupName => groups[groupName]?.isArchived
  );
  
  const allGroups = [...unarchivedGroups, ...archivedGroups];

  const renderGroupItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.groupItem, groups[item]?.isArchived && { opacity: 0.6 }]}
      onPress={() => handleToggleLike(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupItemContent}>
        <Text style={styles.groupItemText}>{item}</Text>
      </View>

      <View style={styles.groupItemIcons}>
        <Ionicons
          name={groups[item]?.isArchived ? "eye-off" : "eye"}
          size={16}
          color={colors.onSurfaceSecondary2}
          style={styles.archiveIcon}
        />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteGroup(item)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name="trash-outline"
            size={16}
            color={colors.accent3}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [groups, handleDeleteGroup, handleToggleLike]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlayBackgroundColor,
      justifyContent: "flex-end", // Position at bottom
    },
    bottomModalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 10,
      elevation: 5,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 6,
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: font.bold,
      color: colors.primary,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    modalDivider: {
      height: 1,
      backgroundColor: colors.borderToPress,
      marginVertical: 10,
    },
    modalBody: {
      maxHeight: "80%",
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    emptyText: {
      fontFamily: font.medium,
      fontSize: 14,
      color: colors.onSurfaceSecondary,
      textAlign: "center",
    },
    flatList: {
      width: "100%",
    },
    groupItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface3,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderToPress2,
    },
    groupItemContent: {
      flex: 1,
      padding: 10,
    },
    groupItemText: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: font.semiBold,
    },
    groupItemIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    archiveIcon: {
      marginRight: 4,
    },
    deleteButton: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    separator: {
      height: 5,
    },
    createGroupButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    createGroupButtonText: {
      fontSize: 14,
      fontFamily: font.semiBold,
      color: colors.surface3,
    },
    disabledButton: {
      backgroundColor: colors.onSurfaceSecondary2,
      opacity: 0.7,
    },
    // Styles for the new Create Group modal
    modalTextInput: {
      fontSize: 14,
      fontFamily: font.medium,
      color: colors.primary,
      borderWidth: 1,
      borderColor: colors.borderToPress,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginLeft: 8,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 14,
      fontFamily: font.semiBold,
      color: colors.primary,
    },
    primaryButtonText: {
      color: colors.surface3,
    },
  });

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
                <Text style={styles.modalTitle}>Select a Group</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalDivider} />
              
              <View style={styles.modalBody}>
                {allGroups.length > 0 ? (
                  <FlatList
                    data={allGroups}
                    keyExtractor={(item) => item}
                    renderItem={renderGroupItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    style={styles.flatList}
                    keyboardShouldPersistTaps="handled"
                  />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      You haven't created any groups
                    </Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.createGroupButton}
                onPress={() => setCreateModalVisible(true)}
              >
                <Text style={styles.createGroupButtonText}>Create New Group</Text>
              </TouchableOpacity>
            </View>
        </SafeAreaView>

      {/* Create Group Modal */}
      <CreateGroupModal
        isVisible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateGroup}
      />
    </Modal>
  );
};



export default GroupSelectionModal;