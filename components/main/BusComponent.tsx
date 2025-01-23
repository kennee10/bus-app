// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { scale, verticalScale } from "react-native-size-matters";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import ArrivalTimingComponent from "./ArrivalTimingComponent";
// import { colors, font } from '../../assets/styles/GlobalStyles';


// type NextBusInfo = {
//   OriginCode: string;
//   DestinationCode: string;
//   EstimatedArrival: string;
//   Monitored: number;
//   Latitude: string;
//   Longitude: string;
//   VisitNumber: string;
//   Load: string;
//   Feature: string;
//   Type: string;
// };

// type BusComponentProps = {
//   busNumber: string;
//   busStopCode: string;
//   nextBuses: NextBusInfo[];
//   isHearted: boolean;
//   onHeartToggle: (busStopCode: string, serviceNo: string) => void;
// };


// const BusComponent: React.FC<BusComponentProps> = (props) => {
//   return (
//     <View style={styles.container}>
//       {/* Bus Number */}
//       <View style={styles.busNumberWrapper}>
//         <Text
//         style={styles.busNumber}
//         adjustsFontSizeToFit
//         numberOfLines={1}
//         >
//           {props.busNumber}
//         </Text>
//       </View>

//       {/* Timings Wrapper */}
//       <View style={styles.busInfoWrapper}>
//         {/* <Text style={styles.busStopCode}>{props.busStopCode}</Text> */}
//         {/* arrival: Represents the current element of the array
//             index: Represents the current index*/}
//         {props.nextBuses.map((arrival, index) => (
//           <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
//         ))}
//       </View>

//       {/* Like Button */}
//       <View style={styles.likeButtonWrapper}>
//         <TouchableOpacity
//           onPress={() => props.onHeartToggle(props.busStopCode, props.busNumber)}
//         >
//           <Ionicons
//             name={props.isHearted ? "heart" : "heart-outline"}
//             color={props.isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
//             size={scale(18)}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingLeft: scale(8),
//     paddingRight: scale(8),
//     margin: scale(2.5),
//     borderRadius: scale(4),
//     backgroundColor: colors.surface2,
//     // backgroundColor: "#FFE4E1",
    
//     // shadow stuff
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   busNumberWrapper: {
//     flex: 2,
//     alignItems: "center",
//     marginRight: scale(16),
//     // backgroundColor: "green"
//   },
//   busNumber: {
//     fontFamily: "Arial",
//     fontSize: scale(19),
//     fontWeight: "bold",
//     color: colors.secondary
//   },

//   busInfoWrapper: {
//     flex: 12,
//     flexDirection: "row",
//     justifyContent: 'space-between',
//     marginRight: scale(14),
//     // backgroundColor: 'lightslategrey'
//   },

//   likeButtonWrapper: {
//     flex: 1,
//     alignItems: "center",
//     // backgroundColor: 'purple'
//   }
// });

// export default BusComponent;
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from "react-native";
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../../assets/styles/GlobalStyles';
import ArrivalTimingComponent from "./ArrivalTimingComponent";
import { useLikedBuses } from "../context/likedBusesContext";

type NextBusInfo = {
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
};

type BusComponentProps = {
  busNumber: string;
  busStopCode: string;
  nextBuses: NextBusInfo[];
  isHearted: boolean;
  onHeartToggle: (
    groupName: string,
    busStopCode: string,
    serviceNo: string
  ) => Promise<void>;
};

const BusComponent: React.FC<BusComponentProps> = (props) => {
  const { likedBuses, toggleLike, createGroup } = useLikedBuses();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const groupNames = Object.keys(likedBuses);

  const handleHeartPress = () => {
    setModalVisible(true);
  };

  const handleGroupSelect = async (groupName: string) => {
    await toggleLike(groupName, props.busStopCode, props.busNumber);
    setModalVisible(false);
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      await createGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Bus Number */}
      <View style={styles.busNumberWrapper}>
        <Text style={styles.busNumber} adjustsFontSizeToFit numberOfLines={1}>
          {props.busNumber}
        </Text>
      </View>

      {/* Timings Wrapper */}
      <View style={styles.busInfoWrapper}>
        {props.nextBuses.map((arrival, index) => (
          <ArrivalTimingComponent key={index} arrivalInfo={arrival} />
        ))}
      </View>

      {/* Like Button */}
      <View style={styles.likeButtonWrapper}>
        <TouchableOpacity onPress={handleHeartPress}>
          <Ionicons
            name={props.isHearted ? "heart" : "heart-outline"}
            color={props.isHearted ? colors.accent5 : colors.onSurfaceSecondary2}
            size={scale(18)}
          />
        </TouchableOpacity>
      </View>

      {/* Modal for Group Selection */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Group</Text>
            <FlatList
              data={groupNames}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupItem}
                  onPress={() => handleGroupSelect(item)}
                >
                  <Text style={styles.groupText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="Create new group"
              value={newGroupName}
              onChangeText={setNewGroupName}
              onSubmitEditing={handleCreateGroup}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: scale(8),
    paddingRight: scale(8),
    margin: scale(2.5),
    borderRadius: scale(4),
    backgroundColor: colors.surface2,
    // backgroundColor: "#FFE4E1",
    
    // shadow stuff
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  busNumberWrapper: {
    flex: 2,
    alignItems: "center",
    marginRight: scale(16),
  },
  busNumber: {
    fontSize: scale(19),
    fontWeight: "bold",
    color: colors.secondary,
  },
  busInfoWrapper: {
    flex: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: scale(14),
  },
  likeButtonWrapper: {
    flex: 1,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  groupItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  groupText: {
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.accent5,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BusComponent;

