import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { colors, font } from '../../assets/styles/GlobalStyles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";



type BusArrivalInfo = {
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  Load: string;
  Type: string;
};

type ArrivalTimingComponentProps = {
  arrivalInfo: BusArrivalInfo;
};

const getBusLoad = (load: string): JSX.Element => {
  if (load === "SEA") {
    return <View style={styles.circle} />
  } else if (load === "SDA") {
    // Return two dot-single elements for SDA
    return (
      <>
        <View style={styles.circle} />
        <View style={styles.circle} />
      </>
    );
  } else if (load === "LSD") {
    // Return three dot-single elements for LSD
    return (
      <>
        <View style={styles.circle} />
        <View style={styles.circle} />
        <View style={styles.circle} />
      </>
    );
  } else {
    return <EntypoIcons name="help-with-circle" color={colors.warning} size={scale(10)} />;
  }
};

const getBusType = (type: string): JSX.Element => {
  if (type === "SD") {
    return <MaterialCommunityIcons name="bus-side" color={colors.accent} size={scale(17)} />
  } else if (type === "DD") {
    return <MaterialCommunityIcons name="bus-double-decker" color={colors.accent} size={scale(17)} />
  } else {
    return <MaterialIcons name="bus-alert" color={colors.warning} size={scale(13)} />
  }
}


function calculateTimeLeft(estimatedArrival?: string): {mins: string , secs: string} {
  if (!estimatedArrival) {
    return {mins: "-", secs: ""}; // Return "N/A" if EstimatedArrival is empty or undefined
  }

  const now = new Date(); // Current time
  const arrivalTime = new Date(estimatedArrival); // Convert string to Date

  if (isNaN(arrivalTime.getTime())) {
    return {mins: "-", secs: ""};; // Return error message if the date is invalid
  }

  // Calculate the difference in milliseconds
  const difference = arrivalTime.getTime() - now.getTime();

  if (difference <= 0) {
    return {mins: "Arr", secs: ""};; // If the time has passed or is now
  }

  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(difference / 60000); // 1 minute = 60,000 ms
  const seconds = Math.floor((difference % 60000) / 1000); // Remaining seconds

  return {mins: String(minutes), secs: String(seconds)};
}


const ArrivalTimingComponent: React.FC<ArrivalTimingComponentProps> = ({
  arrivalInfo,
}) => {
  const { EstimatedArrival, Monitored, Latitude, Longitude, Load, Type } = arrivalInfo;

  return (
    <View style={styles.container}>
      {Monitored === 0 && (
        <View style={styles.monitoredWrapper}>
        <Ionicons
          name="warning-outline"
          color={colors.warning}
          size={scale(13)}
        />
      </View>
      )}
      
      
      <View style={styles.timingWrapper}>
        <View style={styles.minsWrapper}>
          <Text
            style={[
              styles.mins,
              calculateTimeLeft(EstimatedArrival).mins === "Arr" && styles.arrivalText
            ]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {calculateTimeLeft(EstimatedArrival).mins}
          </Text>

        </View>
        {calculateTimeLeft(EstimatedArrival).secs !== "" && (
          <View style={styles.secsWrapper}>
          <Text
            style={styles.secs}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {calculateTimeLeft(EstimatedArrival).secs}
          </Text>
        </View>
        )}
        
      </View>
      
      <View style={styles.addInfoWrapper}>
        <View style={styles.busLoadWrapper}>
          {getBusLoad(Load)}
        </View>
        <View style={styles.busTypeWrapper}>
          {getBusType(Type)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(60),
    height: scale(60),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "white",
    // borderRadius: scale(4),
    // borderWidth: scale(1.3)
    // shadow stuff
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
  },
  monitoredWrapper : {

  },
  timingWrapper: {
    width: scale(50),
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(4)
    // backgroundColor: 'yellow',
  },
  minsWrapper : {
    justifyContent: 'flex-end',
    // backgroundColor: 'yellow',
  },
  mins: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: colors.onSurface,
  },
  arrivalText: {
    color: colors.accent3,
  },
  secsWrapper : {
    justifyContent: 'flex-end',
    marginLeft: scale(2),
    // backgroundColor: 'red',
  },
  secs: {
    fontSize: scale(6),
    fontWeight: "bold",
    marginBottom: scale(4),
    color: colors.onSurface,
    // backgroundColor: 'darkseagreen'
  },
  addInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // backgroundColor: 'lightcoral'
  },
  busLoadWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    padding: scale(5),
    backgroundColor: 'green'
  },
  busTypeWrapper: {
    justifyContent: 'center',
    backgroundColor: 'red',
  },



  circle: {
    width: scale(3),        // Width of the circle
    height: scale(3),       // Height of the circle
    borderRadius: scale(10), // Half of the width/height to create a perfect circle
    backgroundColor: colors.accent3, // Color of the circle
    margin: scale(0.6)
  },
  
  // IF want to position absolutely
  // secs: {
  //   position: 'absolute',
  //   bottom: scale(-1),
  //   right: scale(6),
  //   fontSize: scale(6),
  //   fontWeight: "bold",
  //   marginBottom: scale(4),
  //   // backgroundColor: 'darkseagreen'
  // },
});

export default ArrivalTimingComponent;
