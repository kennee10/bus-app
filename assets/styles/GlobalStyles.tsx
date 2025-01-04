import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

export const colors = {
    background: "#141414",
    secondaryBackground: "#35404B",
    text: "white",
    accent: "#b4c0ca",
    highlight: "red",
  };
  
export const font = {
  bold: "Nunito-Bold"
}

export const containerStyles = StyleSheet.create({
    globalContainer: {
      flex: 1,
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
    },
    button: {
      backgroundColor: colors.secondaryBackground, // Background color
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
      color: "#333"
    },
    globalTextMessage: {
      fontSize: scale(14),
      fontFamily: font.bold,
      color: "white",
      textAlign: "center",
    },
    globalErrorText: {
      fontSize: scale(14),
      fontFamily: font.bold,
      color: "red",
      textAlign: "center",
    },
  });