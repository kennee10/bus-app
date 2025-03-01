import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, } from "react-native";
import { useLikedBuses } from "../context/likedBusesContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import GroupSelectionModal from "./GroupSelectionModal";

type BusModalProps = {
    busNumber: string;
    busStopCode: string;
    isVisible: boolean;
    onClose: () => void;
}

const BusModal: React.FC<BusModalProps> = ({
    busNumber,
    busStopCode,
    isVisible,
    onClose,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const { groups, toggleLike } = useLikedBuses();

    const isHearted = Object.values(groups).some((group) => group.busStops[busStopCode]?.includes(busNumber))

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
                        <Text style={styles.modalTitle}>{busStopCode}: {busNumber}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalDivider} />

                    <View style={styles.modalBody}>
                        {/* <Text>{busNumber} {busStopCode}</Text> */}
                        <View style={styles.likeButtonWrapper}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Ionicons
                                name="heart-outline"
                                color={isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
                                size={scale(18)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <GroupSelectionModal
                busNumber={busNumber}
                busStopCode={busStopCode}
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
            />
        </Modal>
    )
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

export default BusModal;