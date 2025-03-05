import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, } from "react-native";
import { useLikedBuses } from "../context/likedBusesContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, font } from "../../assets/styles/GlobalStyles";
import { scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import busFirstLastTimingsData from "../../assets/busFirstLastTimings.json"


interface BusDirection {
    Direction: string;
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
            [stopSequence: string]: BusDirection;
        };
    };
}

const busFirstLastTimings: BusFirstLastTimings = busFirstLastTimingsData as BusFirstLastTimings;

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
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });

    const formatTime = (time: string) => {
      // Ensure time is in HH:mm format
      const [hour, minute] = time.padStart(4, '0').match(/.{1,2}/g) || ['00', '00'];
      const formattedDate = new Date(2000, 0, 1, Number(hour), Number(minute));
  
      // Check if the date is valid
      if (isNaN(formattedDate.getTime())) {
          return "-";
      }
  
      return formattedDate.toLocaleString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
      });
    };
    
    const getBusTimings = (busNumber: string, busStopCode: string) => {
        const busTimings = busFirstLastTimings[busNumber]?.[busStopCode];

        if (!busTimings) return null;

        if (busTimings["1"]) {
            return busTimings["1"];
        }
        const firstAvailableSequence = Object.keys(busTimings)[0];
        return busTimings[firstAvailableSequence] || null;
    }
    
    const timings = getBusTimings(busNumber, busStopCode);

    // Add these helper functions
    const timeToMinutes = (time: string) => {
      const hours = parseInt(time.substring(0, 2), 10);
      const minutes = parseInt(time.substring(2), 10);
      return hours * 60 + minutes;
    };

    const isTimeBetween = (start: string, end: string, current: Date) => {
      const currentMinutes = current.getHours() * 60 + current.getMinutes();
      const startMinutes = timeToMinutes(start);
      let endMinutes = timeToMinutes(end);

      // Handle overnight services (end time < start time)
      if (endMinutes < startMinutes) {
        endMinutes += 1440; // Add 24 hours
        const currentForOvernight = currentMinutes < startMinutes 
          ? currentMinutes + 1440 
          : currentMinutes;
        return currentForOvernight >= startMinutes && currentForOvernight <= endMinutes;
      }
      
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    };

    // Determine which schedule to highlight
    const getActiveSchedule = () => {
      if (!timings) return null;

      const currentDate = new Date();
      
      // Check weekday schedule first (Mon-Fri)
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        return 'weekday';
      }
      
      // Check if current time falls within weekday overnight service
      if (isTimeBetween(timings.WD_FirstBus, timings.WD_LastBus, currentDate)) {
        return 'weekday';
      }

      // Check Saturday schedule
      if (currentDate.getDay() === 6) {
        return 'saturday';
      }

      // Check Sunday schedule
      if (currentDate.getDay() === 0) {
        return 'sunday';
      }

      // Handle weekend overnight services that extend into Monday
      if (currentDate.getDay() === 1) { // Monday
        if (isTimeBetween('0000', timings.WD_LastBus, currentDate)) {
          return 'weekday';
        }
      }

      return null;
    };

    // Use in your render method
    const activeSchedule = getActiveSchedule();
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
                            <Text style={styles.currentTime}>
                                {currentDay} {currentTime}
                            </Text>
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
                        {timings ? (
                            <View style={styles.table}>
                            <View style={styles.row}>
                                <Text style={styles.cellDay}></Text>
                                <Text style={styles.cell}>First Bus</Text>
                                <Text style={styles.cellLast}>Last Bus</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.cellDay, activeSchedule === 'weekday' ? styles.highlightText : null]}>Weekday</Text>
                                <Text style={[styles.cell, activeSchedule === 'weekday' ? styles.highlightText : null]}>{formatTime(timings.WD_FirstBus)}</Text>
                                <Text style={[styles.cellLast, activeSchedule === 'weekday' ? styles.highlightText : null]}>{formatTime(timings.WD_LastBus)}</Text>
                            </View>

                            <View style={[styles.row]}>
                                <Text style={[styles.cellDay, activeSchedule === 'saturday' ? styles.highlightText : null]}>Saturday</Text>
                                <Text style={[styles.cell, activeSchedule === 'saturday' ? styles.highlightText : null]}>{formatTime(timings.SAT_FirstBus)}</Text>
                                <Text style={[styles.cellLast, activeSchedule === 'saturday' ? styles.highlightText : null]}>{formatTime(timings.SAT_LastBus)}</Text>
                            </View>

                            <View style={[styles.row]}>
                                <Text style={[styles.cellDay, activeSchedule === 'sunday' ? styles.highlightText : null]}>Sunday</Text>
                                <Text style={[styles.cell, activeSchedule === 'sunday' ? styles.highlightText : null]}>{formatTime(timings.SUN_FirstBus)}</Text>
                                <Text style={[styles.cellLast, activeSchedule === 'sunday' ? styles.highlightText : null]}>{formatTime(timings.SUN_LastBus)}</Text>
                            </View>
                            </View>
                        ) : (
                            <Text style={styles.noData}>No bus timings available.</Text>
                        )}
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
        height: scale(1),
        backgroundColor: colors.borderToPress,
        marginVertical: scale(10),
      },
      modalBody: {
        maxHeight: "80%",
      },
      likeButtonWrapper: {
        flexDirection: "row"
      },
      currentTime: {
        flex: 1,
        fontSize: scale(13),
        color: colors.secondary,
        marginTop: scale(4),
      },
      table: {
        borderWidth: scale(1),
        borderColor: colors.borderToPress,
        borderRadius: scale(5),
        marginVertical: scale(15),
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: scale(8),
        paddingHorizontal: scale(10),
        borderBottomColor: colors.borderToPress,
      },
      cell: {
        flex: 1,
        textAlign: "center",
        fontSize: scale(13),
        fontFamily: font.medium,
        color: colors.onSurfaceSecondary,
      },
      cellLast: {
        flex: 0.7,
        textAlign: "center",
        fontSize: scale(13),
        fontFamily: font.medium,
        color: colors.onSurfaceSecondary,
      },
      cellDay: {
        flex: 0.5,
        textAlign: "right",
        fontSize: scale(13),
        fontFamily: font.medium,
        color: colors.onSurfaceSecondary,
      },
      highlightText: {
        color: colors.secondary,
      },
      noData: {
        fontSize: scale(13),
        color: colors.onSurfaceSecondary2,
        textAlign: "center",
        marginTop: scale(10),
      },
})

export default LikedBusesBusModal;