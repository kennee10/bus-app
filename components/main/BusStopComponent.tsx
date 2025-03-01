import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { scale, verticalScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, font } from '../../assets/styles/GlobalStyles';
import BusComponent from "./BusComponent";
import fetchBusArrival from "../apis/fetchBusArrival";
import { useLikedBuses } from "../context/likedBusesContext";
import { Keyboard } from "react-native";
import BusModal from "./BusModal";

type BusArrivalInfo = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
  lastUpdated?: Date; // Individual lastUpdated timestamp
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  nextBuses: BusArrivalInfo[];
};

type BusStopComponentProps = {
  BusStopCode: string;
  Description: string;
  RoadName: string;
  Distance: string;
  isLiked: boolean;
  onLikeToggle: (busStopCode: string) => void;
  searchQuery: string;
  allBusServices: string[]; // Add this prop to pass all possible bus services for the bus stop
};

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return [text];

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const lowerPart = part.toLowerCase();
    const lowerQuery = query.toLowerCase();
    return lowerPart === lowerQuery ? (
      <Text key={index} style={styles.highlight}>{part}</Text>
    ) : (
      part
    );
  });
};

const BusStopComponent: React.FC<BusStopComponentProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initial state is collapsed
  const [busArrivalData, setBusArrivalData] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { groups } = useLikedBuses();
  const [isBusModalVisible, setBusModalVisible] = useState(false);
  const [selectedBusNumber, setSelectedBusNumber] = useState<string | null>(null);


  useEffect(() => {
    let intervalId; 
    let latestBusArrivalData = busArrivalData; // Create a local reference
    
    const fetchAndSetBusArrivalData = async () => {
      try {
        const fetchedData = await fetchBusArrival(props.BusStopCode);
  
        const updatedData = fetchedData.map((service: BusService) => ({
          ...service,
          nextBuses: service.nextBuses.map((bus: BusArrivalInfo, index: number) => {
            // Use local reference instead of state
            const existingBusService = latestBusArrivalData.find(
              (existingService) => existingService.ServiceNo === service.ServiceNo
            );
  
            const existingBus = existingBusService?.nextBuses[index];
  
            return {
              ...bus,
              lastUpdated:
                existingBus && 
                existingBus.EstimatedArrival === bus.EstimatedArrival && 
                existingBus.Latitude === bus.Latitude && 
                existingBus.Longitude === bus.Longitude
                  ? existingBus.lastUpdated
                  : new Date(),
            };
          }),
        }));
  
        latestBusArrivalData = updatedData; // Update local reference
        setBusArrivalData(updatedData);
      } catch (error) {
        console.error("BusStopComponent.tsx: Failed to fetch bus data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndSetBusArrivalData();
    intervalId = setInterval(fetchAndSetBusArrivalData, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Find buses not in operation
  const busesNotInOperation = props.allBusServices?.filter(
    (service) => !busArrivalData.some((bus) => bus.ServiceNo === service)
  )?.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '') || '0');
    const numB = parseInt(b.replace(/\D/g, '') || '0');
      
    // First compare numerical parts
    if (numA !== numB) return numA - numB;

     // If numbers are equal, compare the full string
     return a.localeCompare(b);
    });

  

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => {
        setIsCollapsed(!isCollapsed)
        Keyboard.dismiss()
        }}
        style={styles.container}>
        {/* Upper Section */}
        <View style={styles.upper}>
          <View style={styles.busStopCodeWrapper}>
            <Text style={styles.busStopCode} adjustsFontSizeToFit numberOfLines={1}>
              {props.searchQuery
                ? highlightText(props.BusStopCode, props.searchQuery)
                : props.BusStopCode}
            </Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description} adjustsFontSizeToFit numberOfLines={1}>
              {props.searchQuery
                ? highlightText(props.Description, props.searchQuery)
                : props.Description}
            </Text>
          </View>
          <View
            style={styles.likeButtonWrapper}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity onPress={() => {
              props.onLikeToggle(props.BusStopCode)
              Keyboard.dismiss()
              }}>
              <Ionicons
                name={props.isLiked ? "star" : "star-outline"}
                color={props.isLiked ? colors.accent4 : colors.onSurfaceSecondary2}
                size={scale(21)}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Lower Section */}
        <View style={styles.lower}>
          <View style={styles.distanceWrapper}>
            <Text style={styles.distance}>{props.Distance}m</Text>
          </View>
          <View style={styles.roadNameWrapper}>
            <Text style={styles.roadName}>
              {props.searchQuery
                ? highlightText(props.RoadName, props.searchQuery)
                : props.RoadName}
            </Text>
          </View>
          <View style={styles.blackSpace2}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.onSurfaceSecondary} />
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Bus arrival timings */}
      {!isCollapsed && (
        <View style={styles.busesContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.onSurfaceSecondary} />
          ) : busArrivalData.length > 0 && busArrivalData[0].nextBuses.length > 0 ? (
            busArrivalData.map((busService, index) => (
              <BusComponent
                key={index}
                busNumber={busService.ServiceNo}
                busStopCode={props.BusStopCode}
                nextBuses={busService.nextBuses}
                isHearted={Object.values(groups).some(
                  (group) => group.busStops[props.BusStopCode]?.includes(busService.ServiceNo))}
              />
            ))
          ) : (
            <View style={styles.noBusesWrapper}>
              <Text style={styles.noBusesText}>
                No buses are currently in operation
              </Text>
            </View>
          )}

        
        </View>
      )}

      {/* Buses not in operation */}
      {!isCollapsed && busesNotInOperation?.length > 0 && !isLoading && (
        <View style={styles.notInOperationContainer}>
          <Text style={styles.notOperationalText}>Not In Operation</Text>
          <View style={styles.notInOperationGrid}>
            {busesNotInOperation.map((busService) => (
              <TouchableOpacity 
                key={busService}
                onPress={() => {
                  setSelectedBusNumber(busService)
                  setBusModalVisible(true);
                }}
              >
              <View style={styles.notInOperationBox}>
                  <View style={styles.diagonalLine} />
                  <Text style={styles.notInOperationText}>{busService}</Text>
              </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {/* where should i put my busmodal if i want access to the busesnotinoperation busnumbers and my busstopcode of this component? */}
      <BusModal
        busNumber={selectedBusNumber || ""}
        busStopCode={props.BusStopCode}
        isVisible={isBusModalVisible}
        onClose={() => setBusModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    color: colors.primary,
    fontFamily: font.bold,
  },
  outerContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    padding: scale(2),
    marginBottom: verticalScale(7),
    borderRadius: scale(4),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderToPress,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  upper: {
    flex: 1,
    height: scale(30),
    width: "100%",
    flexDirection: "row",
  },
  lower: {
    flex: 1,
    height: scale(25),
    width: "100%",
    flexDirection: "row",
  },
  busStopCodeWrapper: {
    flex: 6.1,
  },
  descriptionWrapper: {
    flex: 19,
  },
  likeButtonWrapper: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  busStopCode: {
    fontSize: scale(14),
    lineHeight: scale(30),
    paddingLeft: scale(7),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  description: {
    fontSize: scale(16.5),
    lineHeight: scale(30),
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  distanceWrapper: {
    flex: 6.1,
    height: scale(25),
    justifyContent: 'center',
  },
  roadNameWrapper: {
    flex: 19,
    height: scale(25),
    paddingBottom: scale(2),
    justifyContent: 'center',
  },
  blackSpace2: {
    flex: 2.5,
  },
  distance: {
    fontSize: scale(10),
    paddingLeft: scale(7),
    textAlign: "left",
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary,
  },
  roadName: {
    fontSize: scale(14),
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary,
  },
  busesContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  noBusesWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: scale(2.5),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  noBusesText: {
    flex: 1,
    fontFamily: font.bold,
    color: colors.warning,
    textAlign: "center",
  },
  notInOperationContainer: {
    marginTop: scale(8),
    marginLeft: scale(5),
    marginRight: scale(5),
    padding: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  notOperationalText: {
    fontSize: scale(10.5),
    fontFamily: font.semiBold,
    marginBottom: scale(4),
    color: colors.onSurfaceSecondary2,
  },
  notInOperationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(6),
  },
  notInOperationBox: {
    borderRadius: scale(4),
    width: scale(33),
    height: scale(33),
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Enables absolute positioning of the diagonal line
  },
  diagonalLine: {
    position: "absolute",
    width: "140%", // Ensures the line covers the box diagonally
    height: scale(1.5),
    backgroundColor: colors.warning, // Use a distinct color for the cross-out
    transform: [{ rotate: "-45deg" }],
    top: "50%",
    left: "-20%", // Adjust to align the diagonal line correctly
    opacity: 0.25,
  },
  notInOperationText: {
    fontSize: scale(11),
    fontFamily: font.semiBold,
    color: colors.onSurfaceSecondary2,
    textAlign: "center",
  },
});

export default BusStopComponent;