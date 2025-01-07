import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

export const colors = {
    background: "#1E1F22",
    surface: "#2B2D31",
    surface2: "#313338",
    
    onBackground: "#FFFFFF",
    onSurface: "#FFFFFF",
    onBackgroundSecondary: "#84848A",
    onSurfaceSecondary: "#AFAFB2",
    onSurfaceSecondary2: "gray",

    primary: "#aa88ef",
    secondary: "",

    accent: "#1EB980",
    accent2: "#045D56",
    accent3: "#FF6859",
    accent4: "#FFCF44",


    info: 'purple',
    warning: '#FFCF44',
    error: '#FF6859',
    

    
    // might not use
    text: "white",
    secondaryBackground: "#35404B",
  };
  
export const font = {
  bold: "Nunito-Bold"
}

export const containerStyles = StyleSheet.create({
    globalContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background
    },
    pageContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      // backgroundColor: 'red',
    },
    innerPageContainer: {
      flex: 1,
      width: '97%',
      // backgroundColor: 'green',
    },
    button: {
      backgroundColor: colors.surface, // Background color
      padding: scale(10), // Padding inside the button
      borderRadius: scale(5), // Rounded corners
      justifyContent: "center", // Center content vertically
      alignItems: "center", // Center content horizontally
      shadowColor: "#000", // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.25, // Shadow opacity
      shadowRadius: 3.84, // Shadow radius
      elevation: 5, // Shadow for Android
      margin: scale(5)
    },
    iconContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: scale(10),
    },
    loadingText: {
      fontSize: scale(14),
      color: colors.onBackgroundSecondary
    },
    globalTextMessage: {
      fontSize: scale(14),
      fontFamily: font.bold,
      color: colors.onBackground,
      textAlign: "center",
    },
    globalErrorText: {
      fontSize: scale(14),
      fontFamily: font.bold,
      color: colors.error,
      textAlign: "center",
    },
  });