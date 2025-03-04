import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, } from "react-native";
import { useLikedBuses } from "../context/likedBusesContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import GroupSelectionModal from "./GroupSelectionModal";
import { SafeAreaView } from "react-native-safe-area-context";
import busFirstLastTimingsData from "../../assets/busFirstLastTimings.json"


interface BusDirection {
    WD_FirstBus: string;
    WD_LastBus: string;
    SAT_FirstBus: string;
    SAT_LastBus: string;
    SUN_FirstBus: string;
    SUN_LastBus: string;
  }
  
  interface BusFirstLastTimings {
    [serviceNo: string]: {
      [busStopCode: string]: {
        [direction: string]: BusDirection;
      };
    };
  }

const busFirstLastTimings: BusFirstLastTimings = busFirstLastTimingsData as BusFirstLastTimings;

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
    
    

    const busTimings = busFirstLastTimings[busNumber]?.[busStopCode];
    const timings = busTimings?.["2"] || busTimings?.["1"]

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

                        <View style={styles.busFirstLastTimings}>
              {timings ? (
                <>
                  <Text style={styles.timingText}>
                    🕒 Weekday: {timings.WD_FirstBus} - {timings.WD_LastBus}
                  </Text>
                  <Text style={styles.timingText}>
                    🕒 Saturday: {timings.SAT_FirstBus} - {timings.SAT_LastBus}
                  </Text>
                  <Text style={styles.timingText}>
                    🕒 Sunday: {timings.SUN_FirstBus} - {timings.SUN_LastBus}
                  </Text>
                </>
              ) : (
                <Text style={styles.timingText}>No bus timings available.</Text>
              )}
            </View>
                    </View>
                </View>
            </SafeAreaView>

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
      },
      modalHeaderText:{
        flexDirection: "column",
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
      busFirstLastTimings: {
        marginTop: scale(8),
        paddingHorizontal: scale(10),
      },
      timingText: {
        fontSize: scale(14),
        fontFamily: font.medium,
        color: colors.onSurfaceSecondary2,
        marginBottom: scale(4),
      },
})

export default BusModal;