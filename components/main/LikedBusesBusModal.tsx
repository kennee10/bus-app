import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, } from "react-native";
import { useLikedBuses } from "../context/likedBusesContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import GroupSelectionModal from "./GroupSelectionModal";
import { SafeAreaView } from "react-native-safe-area-context";

type BusModalProps = {
    busNumber: string;
    busStopCode: string;
    description?: string;
    groupName: string;
    isVisible: boolean;
    onClose: () => void;
}

const LikedBusesBusModal: React.FC<BusModalProps> = ({
    busNumber,
    busStopCode,
    description,
    groupName,
    isVisible,
    onClose,
}) => {
    const { groups, toggleUnlike } = useLikedBuses();
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
                        <Text style={styles.modalTitle}>
                            {description}{`\n`}
                            {busNumber}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalDivider} />

                    <View style={styles.modalBody}>
                        <View style={styles.likeButtonWrapper}>
                            <TouchableOpacity onPress={() => {
                                toggleUnlike(groupName, busStopCode, busNumber)
                                onClose()
                                }}>
                                <Ionicons
                                name="heart"
                                color={colors.accent5}
                                size={scale(18)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.modalOverlayBackgroundColor,
        justifyContent: "flex-end",
      },
      bottomModalContainer: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        padding: scale(10),
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
        maxHeight: "80%",
      },
      likeButtonWrapper: {
        alignItems: "flex-end"
      },
})

export default LikedBusesBusModal;