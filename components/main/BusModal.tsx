import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useRouter } from 'expo-router';
import Ionicons from "react-native-vector-icons/Ionicons";
import GroupSelectionModal from "./GroupSelectionModal";
import { useLikedBuses } from "../context/likedBusesContext";
import busFirstLastTimingsData from "../../assets/busFirstLastTimings.json";
import { getBusStopsDetails, BusStopWithDistance } from "../hooks/getBusStopsDetails";
import { useTheme } from '../../assets/styles/ThemeContext';

// Define TypeScript types for bus timings data
interface BusDirection {
  Direction: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
  StopSequence?: number;
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
  description: string;
  isVisible: boolean;
  onClose: () => void;
};

const BusModal: React.FC<BusModalProps> = ({
  busNumber,
  busStopCode,
  description,
  isVisible,
  onClose,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { groups } = useLikedBuses();
  const [busStopsDetails, setBusStopsDetails] = useState<BusStopWithDistance[]>([]);
  const [isTimingsExpanded, setIsTimingsExpanded] = useState(false);
  const { colors, font, containerStyles } = useTheme();
  const router = useRouter();

  const handlePress = (busStopCode: string) => {
    onClose();
    router.push({
      pathname: '/',
      params: { query: busStopCode },
      });
    };


  // Ref for scrolling bus stops list
  const scrollViewRef = useRef<ScrollView>(null);

  const isHearted = Object.values(groups).some((group) =>
    group.busStops[busStopCode]?.includes(busNumber)
  );

  // Get current day and time
  const now = new Date();
  const currentDay = now.toLocaleString("en-US", { weekday: "long" });

  // Format a time string (assumed in "HHmm" format) to AM/PM format.
  const formatTime = (time: string) => {
    if (time === "-") {
      return "-"
    }
    const paddedTime = time.padStart(4, "0");
    const hour = paddedTime.slice(0, 2);
    const minute = paddedTime.slice(2);
    const date = new Date(2000, 0, 1, Number(hour), Number(minute));
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get bus timings from the JSON data based on busNumber and busStopCode.
  const getBusTimings = (busNumber: string, busStopCode: string) => {
    const busTimings = busFirstLastTimings[busNumber]?.[busStopCode];
    if (!busTimings) return null;
    if (busTimings["1"]) {
      return busTimings["1"];
    }
    const firstAvailableSequence = Object.keys(busTimings)[0];
    return busTimings[firstAvailableSequence] || null;
  };

  const timings = getBusTimings(busNumber, busStopCode);

  // Helper function: sort stops in the direction of travel.
  const getSortedStopsInDirection = (busNumber: string, direction: number) => {
    const busStops = busFirstLastTimings[busNumber];
    if (!busStops) return [];
    const stopsWithSequence = Object.entries(busStops)
      .flatMap(([stopCode, sequences]) =>
        Object.entries(sequences).map(([sequence, data]) => ({
          stopCode,
          sequence: parseInt(sequence, 10),
          ...data,
        }))
      )
      .filter((stop) => stop.Direction === direction)
      .sort((a, b) => a.sequence - b.sequence);
    return stopsWithSequence;
  };

  // Determine the direction (defaulting to 1 if undefined)
  const direction = timings?.Direction ?? 1;
  const sortedStops = useMemo(
    () => getSortedStopsInDirection(busNumber, direction),
    [busNumber, direction]
  );
  const currentStopIndex = sortedStops.findIndex(
    (stop) => stop.stopCode === busStopCode
  );

  useEffect(() => {
    const fetchBusStopsDetails = async () => {
      try {
        if (sortedStops.length > 0) {
          const stopCodes = sortedStops.map((stop) => stop.stopCode);
          const details = await getBusStopsDetails(stopCodes);
          setBusStopsDetails(details);
        }
      } catch (error) {
        console.error("Error fetching bus stops details:", error);
      }
    };
    fetchBusStopsDetails();
  }, [sortedStops]);

  // Toggle timings dropdown
  const toggleTimings = () => {
    setIsTimingsExpanded(!isTimingsExpanded);
  };

  // Helper function to parse time strings
  const parseTime = (timeStr: string): Date | null => {
  if (timeStr === "-") return null;
  
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  
  if (timeStr.includes(":") || timeStr.includes("AM") || timeStr.includes("PM")) {
    // Already in AM/PM format
    const date = new Date(today);
    const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) return null;
    
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();
    
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    date.setHours(hours, minutes);
    return date;
  } else {
    // In "HHmm" format
    const paddedTime = timeStr.padStart(4, "0");
    const hour = parseInt(paddedTime.slice(0, 2));
    const minute = parseInt(paddedTime.slice(2));
    
    const date = new Date(today);
    date.setHours(hour, minute);
    return date;
  }
  };
  // Determine which schedule to highlight (weekday, Saturday, or Sunday)
  const getActiveSchedule = () => {
    if (!timings) return null;
    
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const nowTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    
    // If it's after midnight but before the last bus of the previous day
    if (nowTime < (4 * 60)) { // Before 4:00 AM, consider it might be the previous day's schedule
      // For Monday after midnight, check if it's before Sunday's last bus
      if (currentDay === "Monday") {
        const sunLastBus = parseTime(timings.SUN_LastBus);
        if (sunLastBus) {
          const sunLastBusMinutes = sunLastBus.getHours() * 60 + sunLastBus.getMinutes();
          // If Sunday's last bus is after midnight and current time is before it
          if (sunLastBusMinutes < (4 * 60) && nowTime < sunLastBusMinutes) {
            return "sunday";
          }
        }
      } 
      // For Saturday after midnight, check if it's before Friday's last bus
      else if (currentDay === "Saturday") {
        const wdLastBus = parseTime(timings.WD_LastBus);
        if (wdLastBus) {
          const wdLastBusMinutes = wdLastBus.getHours() * 60 + wdLastBus.getMinutes();
          if (wdLastBusMinutes < (4 * 60) && nowTime < wdLastBusMinutes) {
            return "weekday";
          }
        }
      } 
      // For Sunday after midnight, check if it's before Saturday's last bus
      else if (currentDay === "Sunday") {
        const satLastBus = parseTime(timings.SAT_LastBus);
        if (satLastBus) {
          const satLastBusMinutes = satLastBus.getHours() * 60 + satLastBus.getMinutes();
          if (satLastBusMinutes < (4 * 60) && nowTime < satLastBusMinutes) {
            return "saturday";
          }
        }
      } 
      // For weekdays (Tue-Fri) after midnight, check if it's before the previous day's last bus
      else if (weekdays.includes(currentDay)) {
        const wdLastBus = parseTime(timings.WD_LastBus);
        if (wdLastBus) {
          const wdLastBusMinutes = wdLastBus.getHours() * 60 + wdLastBus.getMinutes();
          if (wdLastBusMinutes < (4 * 60) && nowTime < wdLastBusMinutes) {
            return "weekday";
          }
        }
      }
    }
    
    // Standard day-based logic if not in the late night scenario
    if (weekdays.includes(currentDay)) return "weekday";
    if (currentDay === "Saturday") return "saturday";
    if (currentDay === "Sunday") return "sunday";
    
    return null;
  };

  const activeSchedule = getActiveSchedule();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modalOverlayBackgroundColor,
      justifyContent: "flex-end",
    },
    bottomModalContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 10,
      paddingBottom: 0,
      elevation: 5,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 6,
    },
    modalHeaderText: {
      flexDirection: "column",
    },
    modalTitle: {
      fontSize: 16,
      fontFamily: font.bold,
      color: colors.primary,
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
    bodyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    currentTime: {
      fontSize: 13,
      color: colors.secondary,
    },
    timingsToggle: {
      flexDirection: "row",
      alignItems: "center",
    },
    toggleText: {
      fontSize: 13,
      fontFamily: font.medium,
      color: colors.onSurfaceSecondary,
      marginLeft: 4,
    },
    table: {
      borderWidth: 1,
      borderColor: colors.borderToPress,
      borderRadius: 4,
      paddingVertical: 6
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    cellDay: {
      flex: 0.5,
      textAlign: "right",
      fontSize: 13,
      fontFamily: font.medium,
      color: colors.onSurfaceSecondary,
    },
    cellFirst: {
      flex: 1.05,
      textAlign: "center",
      fontSize: 13,
      fontFamily: font.medium,
      color: colors.onSurfaceSecondary,
    },
    cellLast: {
      flex: 0.7,
      textAlign: "center",
      fontSize: 13,
      fontFamily: font.medium,
      color: colors.onSurfaceSecondary,
    },
    highlightText: {
      color: colors.secondary,
    },
    busStopsList: {
      marginTop: 10,
      backgroundColor: colors.surface4,
      padding: 8,
      borderRadius: 4,
    },
    pastBusStopItem: {
      padding: 8,
      marginBottom: 8,
      borderRadius: 4,
      backgroundColor: colors.surface2,
      borderWidth: 0.6,
      borderColor: colors.borderToPress,
    },
    busStopItem: {
      padding: 8,
      marginBottom: 8,
      borderRadius: 4,
      backgroundColor: colors.surface2,
      borderWidth: 0.6,
      borderColor: colors.accent8,
    },
    currentBusStopItem: {
      backgroundColor: colors.accent8,
    },
    busStopText: {
      fontSize: 13,
      fontFamily: font.medium,
    },
  });

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomModalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle} adjustsFontSizeToFit numberOfLines={1}>
                {description}
              </Text>
              <Text style={styles.modalTitle}>{busNumber}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.onSurfaceSecondary2} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalDivider} />
          <View style={styles.modalBody}>
            <View style={styles.bodyHeader}>
              {/* Display current time for context */}
              <TouchableOpacity onPress={toggleTimings} style={styles.timingsToggle}>
                <Ionicons
                    name={isTimingsExpanded ? "chevron-down" : "chevron-forward"}
                    size={14}
                    color={colors.onSurfaceSecondary}
                  />
                  <Text style={styles.toggleText}>
                    First / Last Bus
                  </Text>
              </TouchableOpacity>
              
              {/* Spacer to push other items right */}
              <View style={{ flex: 1 }} />
              {/* Timings dropdown toggle */}
              
              {/* Heart icon on the far right */}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons
                  name="heart-outline"
                  color={isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            {/* Timings Table (dropdown) */}
            {isTimingsExpanded && timings && (
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={styles.cellDay}></Text>
                  <Text style={styles.cellFirst}>First Bus</Text>
                  <Text style={styles.cellLast}>Last Bus</Text>
                </View>
                {/* Replace the existing table rows with these */}
                <View style={styles.row}>
                  <Text style={[styles.cellDay, activeSchedule === "weekday" && styles.highlightText]}>
                    Weekday
                  </Text>
                  <Text style={[styles.cellFirst, activeSchedule === "weekday" && styles.highlightText]}>
                    {formatTime(timings.WD_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, activeSchedule === "weekday" && styles.highlightText]}>
                    {formatTime(timings.WD_LastBus)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cellDay, activeSchedule === "saturday" && styles.highlightText]}>
                    Saturday
                  </Text>
                  <Text style={[styles.cellFirst, activeSchedule === "saturday" && styles.highlightText]}>
                    {formatTime(timings.SAT_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, activeSchedule === "saturday" && styles.highlightText]}>
                    {formatTime(timings.SAT_LastBus)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cellDay, activeSchedule === "sunday" && styles.highlightText]}>
                    Sunday
                  </Text>
                  <Text style={[styles.cellFirst, activeSchedule === "sunday" && styles.highlightText]}>
                    {formatTime(timings.SUN_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, activeSchedule === "sunday" && styles.highlightText]}>
                    {formatTime(timings.SUN_LastBus)}
                  </Text>
                </View>
              </View>
            )}
            {/* Bus Stops List */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.busStopsList}
              onLayout={() => {
                if (scrollViewRef.current && currentStopIndex >= 0) {
                  scrollViewRef.current.scrollTo({ y: currentStopIndex * 40, animated: true });
                }
              }}
            >
              {sortedStops.map((stop, index) => {
                const isPast = index < currentStopIndex;
                const isCurrent = index === currentStopIndex;
                const detail = busStopsDetails.find((d) => d.BusStopCode === stop.stopCode);
                const stopDescription = isCurrent ? description : detail?.Description || "";
                return (
                  <TouchableOpacity
                    onPress={() => handlePress(stop.stopCode)}
                    key={`${busNumber}-${stop.stopCode}-${stop.sequence}`}
                    style={[
                      styles.busStopItem,
                      isCurrent && styles.currentBusStopItem,
                      isPast && styles.pastBusStopItem,
                    ]}
                  >
                    <Text style={[styles.busStopText, {
                      color: isPast ? colors.onSurfaceSecondary2 : colors.onSurface
                    }]}>
                      {stop.stopCode} - {stopDescription}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
  );
};



export default BusModal;
