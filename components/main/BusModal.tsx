import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import GroupSelectionModal from "./GroupSelectionModal";
import { useLikedBuses } from "../context/likedBusesContext";
import { colors, containerStyles, font } from "../../assets/styles/GlobalStyles";
import busFirstLastTimingsData from "../../assets/busFirstLastTimings.json";
import { getBusStopsDetails, BusStopWithDistance } from "../hooks/getBusStopsDetails";
import DonationTicker from "@/components/main/DonationTicker";

// Instead of importing as a module, use require so we can use Asset.fromModule
const MRTMap = require("../../assets/images/MRTMap.svg");

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

  // Ref for scrolling bus stops list
  const scrollViewRef = useRef<ScrollView>(null);

  const isHearted = Object.values(groups).some((group) =>
    group.busStops[busStopCode]?.includes(busNumber)
  );

  // Get current day and time
  const now = new Date();
  const currentDay = now.toLocaleString("en-US", { weekday: "long" });
  const currentTime = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const isWeekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(currentDay);

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

  // Scroll to current stop when modal opens
  // useEffect(() => {
  //   if (isVisible && scrollViewRef.current && currentStopIndex >= 0) {
  //     scrollViewRef.current.scrollTo({ y: currentStopIndex * scale(40), animated: true });
  //   }
  // }, [isVisible, currentStopIndex]);

  // Fetch bus stop details for sorted stops
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

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalOverlay} edges={["top", "bottom"]}>
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
              <Ionicons name="close" size={scale(20)} color={colors.onSurfaceSecondary2} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalDivider} />
          <View style={styles.modalBody}>
            <View style={styles.bodyHeader}>
              {/* Display current time for context */}
              <TouchableOpacity onPress={toggleTimings} style={styles.timingsToggle}>
                <Ionicons
                    name={isTimingsExpanded ? "chevron-down" : "chevron-forward"}
                    size={scale(14)}
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
                  size={scale(18)}
                />
              </TouchableOpacity>
            </View>
            {/* Timings Table (dropdown) */}
            {isTimingsExpanded && timings && (
              <View style={styles.table}>
                {/* <View style={styles.row}>
                  <Text style={styles.currentTime}>
                    {currentDay} {currentTime}
                  </Text>
                </View> */}
                <View style={styles.row}>
                  <Text style={styles.cellDay}></Text>
                  <Text style={styles.cellFirst}>First Bus</Text>
                  <Text style={styles.cellLast}>Last Bus</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cellDay, isWeekday ? styles.highlightText : null]}>
                    Weekday
                  </Text>
                  <Text style={[styles.cellFirst, isWeekday ? styles.highlightText : null]}>
                    {formatTime(timings.WD_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, isWeekday ? styles.highlightText : null]}>
                    {formatTime(timings.WD_LastBus)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cellDay, currentDay === "Saturday" ? styles.highlightText : null]}>
                    Saturday
                  </Text>
                  <Text style={[styles.cellFirst, currentDay === "Saturday" ? styles.highlightText : null]}>
                    {formatTime(timings.SAT_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, currentDay === "Saturday" ? styles.highlightText : null]}>
                    {formatTime(timings.SAT_LastBus)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cellDay, currentDay === "Sunday" ? styles.highlightText : null]}>
                    Sunday
                  </Text>
                  <Text style={[styles.cellFirst, currentDay === "Sunday" ? styles.highlightText : null]}>
                    {formatTime(timings.SUN_FirstBus)}
                  </Text>
                  <Text style={[styles.cellLast, currentDay === "Sunday" ? styles.highlightText : null]}>
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
                  scrollViewRef.current.scrollTo({ y: currentStopIndex * scale(40), animated: true });
                }
              }}
            >
              {sortedStops.map((stop, index) => {
                const isPast = index < currentStopIndex;
                const isCurrent = index === currentStopIndex;
                const detail = busStopsDetails.find((d) => d.BusStopCode === stop.stopCode);
                const stopDescription = isCurrent ? description : detail?.Description || "";
                return (
                  <View
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
                  </View>
                );
              })}
            </ScrollView>
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
  );
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
    paddingBottom: 0,
    elevation: 5,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(6),
  },
  modalHeaderText: {
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
  bodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(10),
  },
  currentTime: {
    fontSize: scale(13),
    color: colors.secondary,
  },
  timingsToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleText: {
    fontSize: scale(13),
    fontFamily: font.medium,
    color: colors.onSurfaceSecondary,
    marginLeft: scale(4),
  },
  table: {
    borderWidth: scale(1),
    borderColor: colors.borderToPress,
    borderRadius: scale(4),
    paddingVertical: scale(6)
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: scale(4),
    paddingHorizontal: scale(10),
  },
  cellDay: {
    flex: 0.5,
    textAlign: "right",
    fontSize: scale(13),
    fontFamily: font.medium,
    color: colors.onSurfaceSecondary,
  },
  cellFirst: {
    flex: 1.05,
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
  highlightText: {
    color: colors.secondary,
  },
  busStopsList: {
    marginTop: scale(10),
    backgroundColor: colors.surface4,
    padding: scale(8),
    borderRadius: scale(4),
  },
  pastBusStopItem: {
    padding: scale(8),
    marginBottom: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    borderWidth: scale(0.6),
    borderColor: colors.borderToPress,
  },
  busStopItem: {
    padding: scale(8),
    marginBottom: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    borderWidth: scale(0.6),
    borderColor: colors.accent8,
  },
  currentBusStopItem: {
    backgroundColor: colors.accent8,
  },
  busStopText: {
    fontSize: scale(13),
    fontFamily: font.medium,
  },
});

export default BusModal;
