import React, { useRef } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { colors, font, containerStyles } from "../../assets/styles/GlobalStyles";

type GroupSelectionModalProps = {
  isVisible: boolean;
  groups: Record<string, any>;
  onClose: () => void;
  onToggleLike: (groupName: string) => Promise<void>;
  onCreateGroup: (groupName: string) => Promise<void>;
  onDeleteGroup: (groupName: string) => Promise<void>;
};

const GroupSelectionModal: React.FC<GroupSelectionModalProps> = ({
  isVisible,
  groups,
  onClose,
  onToggleLike,
  onCreateGroup,
  onDeleteGroup,
}) => {
  // Use a ref to hold the current text without causing re-renders.
  const groupNameRef = useRef<string>("");
  // Use a ref for the TextInput component to clear its content after submission.
  const textInputRef = useRef<TextInput>(null);

  const handleCreateGroup = async (groupName: string) => {
    const trimmedName = groupName.trim();
    if (trimmedName) {
      await onCreateGroup(trimmedName); // Create group first
      await onToggleLike(trimmedName);   // Then toggle the like for the bus
      // Clear the TextInput field and reset the ref value.
      textInputRef.current?.clear();
      groupNameRef.current = "";
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    Alert.alert("Delete Group", `Are you sure you want to delete "${groupName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => await onDeleteGroup(groupName), style: "destructive" },
    ]);
  };

  const groupNames = Object.keys(groups);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select a Group</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" style={styles.modalCrossIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {groupNames.length > 0 ? (
              <FlatList
                data={groupNames}
                keyExtractor={(item) => item}
                style={styles.flatList}
                renderItem={({ item }) => (
                  <View style={styles.groupItem}>
                    <TouchableOpacity
                      style={styles.groupItemContent}
                      onPress={() => {
                        onToggleLike(item);
                        onClose(); // This closes the modal
                      }}
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
                )}
                ItemSeparatorComponent={() => <View style={{ height: scale(7) }} />}
              />
            ) : (
              <Text style={[containerStyles.globalInfoTextMessage, styles.noGroups]}>
                You haven't created a group
              </Text>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              multiline={true}
              placeholder="Create new group (eg. Home → Work)"
              placeholderTextColor={colors.onSurfaceSecondary2}
              // Update the ref value on every change.
              onChangeText={(text) => (groupNameRef.current = text)}
              // You can also use onSubmitEditing to immediately submit:
              onSubmitEditing={(event) => handleCreateGroup(event.nativeEvent.text)}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => handleCreateGroup(groupNameRef.current)}
            >
              <FontAwesome6 name="check" color={colors.onSurface} size={scale(14)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackgroundOpacity,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.surface3,
    borderRadius: scale(6),
    borderWidth: scale(1),
    borderColor: colors.borderToPress2,
    padding: scale(10),
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(5),
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
  flatList: {
    width: "100%",
    maxHeight: scale(300),
  },
  noGroups: {
    paddingTop: scale(20),
    paddingBottom: scale(20),
    fontFamily: font.semiBold,
    fontSize: scale(13),
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: scale(4),
    width: "100%",
  },
  groupItemContent: {
    flex: 1,
    padding: scale(10),
  },
  groupText: {
    fontSize: scale(14),
    color: colors.primary,
    fontFamily: font.semiBold,
  },
  deleteButton: {
    padding: scale(10),
  },
  modalFooter: {
    flexDirection: "row",
    marginTop: scale(6),
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

export default GroupSelectionModal;
