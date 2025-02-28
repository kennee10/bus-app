import React, { useRef, useState, useCallback } from "react";
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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { colors, font, containerStyles } from "../../assets/styles/GlobalStyles";
import { useLikedBuses } from "../context/likedBusesContext";

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
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>
              <View style={styles.bottomModalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Create New Group</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
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
          </View>
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
          size={scale(16)}
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
            size={scale(16)}
            color={colors.accent3}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [groups, handleDeleteGroup, handleToggleLike]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
            <View style={styles.bottomModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select a Group</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
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
                    scrollIndicatorInsets={{ right: 1 }} // Fix for Android scrollbar
                    contentContainerStyle={{ paddingBottom: scale(8) }}
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
        </View>

      {/* Create Group Modal */}
      <CreateGroupModal
        isVisible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateGroup}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlayBackgroundColor,
    justifyContent: "flex-end", // Position at bottom
  },
  bottomModalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    padding: scale(16),
    elevation: 5,
    maxHeight: "80%",
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
    height: 1,
    backgroundColor: colors.borderToPress,
    marginVertical: scale(10),
  },
  modalBody: {
    maxHeight: scale(300),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: scale(20),
  },
  emptyText: {
    fontFamily: font.medium,
    fontSize: scale(14),
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
    borderRadius: scale(4),
    borderWidth: scale(0.5),
    borderColor: colors.borderToPress2,
  },
  groupItemContent: {
    flex: 1,
    padding: scale(10),
  },
  groupItemText: {
    fontSize: scale(14),
    color: colors.primary,
    fontFamily: font.semiBold,
  },
  groupItemIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  archiveIcon: {
    marginRight: scale(4),
  },
  deleteButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
  },
  separator: {
    height: scale(5),
  },
  createGroupButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(8),
    padding: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(16),
  },
  createGroupButtonText: {
    fontSize: scale(14),
    fontFamily: font.semiBold,
    color: colors.surface3,
  },
  disabledButton: {
    backgroundColor: colors.onSurfaceSecondary2,
    opacity: 0.7,
  },
  // Styles for the new Create Group modal
  modalTextInput: {
    fontSize: scale(14),
    fontFamily: font.medium,
    color: colors.primary,
    borderWidth: scale(1),
    borderColor: colors.borderToPress,
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(10),
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(4),
    marginLeft: scale(8),
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

export default GroupSelectionModal;