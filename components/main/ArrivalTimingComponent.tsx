import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import InfoModal from "./InfoModal";
import { useTheme } from '../../assets/styles/ThemeContext';


type BusArrivalInfo = {
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  Load: string;
  Type: string;
  lastUpdated?: Date;
};

type ArrivalTimingComponentProps = {
  arrivalInfo: BusArrivalInfo;
};


const ArrivalTimingComponent: React.FC<ArrivalTimingComponentProps> = ({
  arrivalInfo,
}) => {
  const { EstimatedArrival, Monitored, Latitude, Longitude, Load, Type, lastUpdated } = arrivalInfo;
  const { mins, secs } = calculateTimeLeft(EstimatedArrival);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colors } = useTheme();

  const getBusLoad = (load: string): JSX.Element => {
    if (load === "SEA") {
      return <View style={{flexDirection: 'row'}}>
                <FontAwesome6 name="user" color={colors.accent5} size={6}/>
              </View>
    } else if (load === "SDA") {
      // Return two dot-single elements for SDA
      return (
          <View style={{flexDirection: 'row'}}>
            <FontAwesome6 name="user" color={colors.accent5} size={6}/>
            <FontAwesome6 name="user" color={colors.accent5} size={6}/>
          </View>
      );
    } else if (load === "LSD") {
      // Return three dot-single elements for LSD
      return (
        <View style={{flexDirection: 'row'}}>
          <FontAwesome6 name="user" color={colors.accent5} size={6}/>
          <FontAwesome6 name="user" color={colors.accent5} size={6}/>
          <FontAwesome6 name="user" color={colors.accent5} size={6}/>
        </View>
      );
    } else {
      return <EntypoIcons name="help-with-circle" color={colors.info} size={9} />;
    }
  };
  
  const getBusType = (type: string): JSX.Element => {
    if (type === "SD") {
      return <MaterialCommunityIcons name="bus-side" color={colors.busIcon} size={13} />
    } else if (type === "DD") {
      return <MaterialCommunityIcons name="bus-double-decker" color={colors.busIcon} size={13} />
    } else if (type === "BD") {
      return (
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="bus-articulated-end" color={colors.busIcon} size={13} />
        <MaterialCommunityIcons name="bus-articulated-front" color={colors.busIcon} size={13} style={{right: 4}}/>
      </View>
      )
    } else {
        return <MaterialIcons name="bus-alert" color={colors.info} size={11} style={{bottom: 1.1}}/>
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

  const determineDotColor = () => {
    if (!lastUpdated) return colors.onSurface2Secondary; // Default color if no updates yet

    const now = new Date();
    const secondsSinceUpdate = (now.getTime() - lastUpdated.getTime()) / 1000;

    if (secondsSinceUpdate <= 15) return colors.accent; // Green dot
    if (secondsSinceUpdate <= 45) return colors.warning; // Yellow dot
    return colors.error; // Red dot
  };

  const dotColor = determineDotColor();

  const styles = StyleSheet.create({
    container: {
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    timingWrapper: {
      width: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 3,
    },
    minsWrapper : {
      justifyContent: 'flex-end',
    },
    mins: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.onSurface2Secondary,
    },
    
    secsWrapper : {
      justifyContent: 'flex-end',
      marginLeft: 2,
    },
    secs: {
      fontSize: 6.3,
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.onSurface2Secondary,
    },
    dotWrapper: {
      position: "absolute",
      top: 5.5,
      left: 8,
    },
    arrivalText: {
      color: colors.accent3,
    },
    monitoredWrapper : {
      position: "absolute",
      top: 4,
      right: 6,
      opacity: 0.7
    },
    
    addInfoWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    busLoadWrapper: {
      justifyContent: 'flex-end',
      flexDirection: 'column',
      padding: 5,
    },
    busTypeWrapper: {
      justifyContent: 'center',
    },
  });

  return (
    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
    <View style={styles.container}>
      {Monitored === 0 && mins !== "-" && (
        <View style={styles.monitoredWrapper}>
          <MaterialCommunityIcons
            name="clock-alert"
            color={colors.accent7}
            size={8}
          />
        </View>
      )}

      {/* Blinking Dot */}
      {Monitored === 1 && mins !== "-" && (
        <View style={styles.dotWrapper}>
          <View style={{
            width: 1.5,
            height: 6,
            borderRadius: 5, // Makes it a circle
            backgroundColor: dotColor
          }} />
          {/* <BlinkingDotComponent dotColor={dotColor}/> */}
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
     
      
      
      <InfoModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)}
        />
    </View>
     </TouchableOpacity>
  );
};



export default ArrivalTimingComponent;
