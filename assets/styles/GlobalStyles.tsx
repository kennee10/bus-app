import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

export const colors = {
    background: "black",
    secondaryBackground: "#35404B",
    text: "white",
    accent: "#b4c0ca",
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
      // backgroundColor: "red",
    },
    pageContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: colors.background,
      backgroundColor: 'red',
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