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
    description: string;
    isVisible: boolean;
    onClose: () => void;
}

const BusModal: React.FC<BusModalProps> = ({
    busNumber,
    busStopCode,
    description,
    isVisible,
    onClose,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const { groups } = useLikedBuses();

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
                        <View style={styles.modalHeaderText}>
                            <Text style={styles.modalTitle} adjustsFontSizeToFit numberOfLines={1}>
                                {description}
                            </Text>
                            <Text style={styles.modalTitle}>
                                {busNumber}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalDivider} />

                    <View style={styles.modalBody}>
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
        backgroundColor: 'yellow'
      },
      modalHeaderText:{
        flexDirection: "column",
        backgroundColor: 'red'
      },
      modalTitle: {
        fontSize: scale(16),
        fontFamily: font.bold,
        color: colors.primary,
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