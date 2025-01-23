import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { colors, font } from '../../assets/styles/GlobalStyles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";



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
    // return <View style={styles.circle} />
    return <View style={{flexDirection: 'row'}}>
              <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
          </View>
  } else if (load === "SDA") {
    // Return two dot-single elements for SDA
    return (
        <View style={{flexDirection: 'row'}}>
          <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
          <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
        </View>
    );
  } else if (load === "LSD") {
    // Return three dot-single elements for LSD
    return (
      <View style={{flexDirection: 'row'}}>
        <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
        <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
        <FontAwesome6 name="user" color={colors.accent5} size={scale(6)}/>
      </View>
    );
  } else {
    return <EntypoIcons name="help-with-circle" color={colors.info} size={scale(9)} />;
  }
};

const getBusType = (type: string): JSX.Element => {
  if (type === "SD") {
    return <MaterialCommunityIcons name="bus-side" color={colors.accent} size={scale(13.5)} />
  } else if (type === "DD") {
    return <MaterialCommunityIcons name="bus-double-decker" color={colors.accent} size={scale(13.5)} />
  } else if (type === "BD") {
    return (
    <View style={{flexDirection: 'row'}}>
      <MaterialCommunityIcons name="bus-articulated-end" color={colors.accent} size={scale(13.5)} />
      <MaterialCommunityIcons name="bus-articulated-front" color={colors.accent} size={scale(13.5)} style={{right: scale(4)}}/>
    </View>
    )
  } else {
      return <MaterialIcons name="bus-alert" color={colors.info} size={scale(11)} style={{bottom: scale(1.1)}}/>
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

  if (difference <= 10000) {
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

  const { mins, secs } = calculateTimeLeft(EstimatedArrival);

  return (
    <View style={styles.container}>
      
      {Monitored === 0 && mins !== "-" && (
        <View style={styles.monitoredWrapper}>
          <Ionicons
            name="warning-outline"
            color={colors.warning}
            size={scale(8.8)}
          />
        </View>
      )}
      
      
      <View style={styles.timingWrapper}>
        <View style={styles.minsWrapper}>
          <Text
            style={[
              styles.mins,
              mins === "Arr" && styles.arrivalText,
              mins === '0' && styles.arrivalText
            ]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {mins}
          </Text>

        </View>
        {secs !== "" && (
          <View style={styles.secsWrapper}>
          <Text
            style={[
              styles.secs,
              mins === '0' && styles.arrivalText
            ]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {secs}
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
    // width: scale(60),
    // height: scale(60),
    padding: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "white",
  },
  monitoredWrapper : {
    position: "absolute",
    top: scale(4),
    right: scale(6),
  },
  timingWrapper: {
    width: scale(50),
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(3),
    // backgroundColor: 'yellow',
  },
  minsWrapper : {
    justifyContent: 'flex-end',
    // backgroundColor: 'yellow',
  },
  mins: {
    fontSize: scale(18.5),
    fontWeight: "bold",
    color: colors.onSurface2Secondary,
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
    fontSize: scale(5.8),
    fontWeight: "bold",
    marginBottom: scale(4),
    color: colors.onSurface2Secondary,
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
    // backgroundColor: 'green'
  },
  busTypeWrapper: {
    justifyContent: 'center',
    // backgroundColor: 'red',
  },



  circle: {
    width: scale(3),        // Width of the circle
    height: scale(3),       // Height of the circle
    // borderRadius: scale(10), // Half of the width/height to create a perfect circle
    backgroundColor: colors.accent6, // Color of the circle
    margin: scale(0.6)
  },
});

export default ArrivalTimingComponent;
