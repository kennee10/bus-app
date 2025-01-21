import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

export const colors = {
    background: "#0d0d0d",
    surface: "#26292e",
    surface2: "#2c2e33",
    
    onBackground: "#FFFFFF",
    onBackgroundSecondary: "#84848A",
    onBackgroundSecondary2: "#5b5c5f",
    
    onSurface: "#FFFFFF",
    onSurfaceSecondary: "#AFAFB2",
    onSurfaceSecondary2: "gray",
    
    onSurface2: "#FFFFFF",
    onSurface2Secondary: "#bdbdbd",
    

    primary: "#a17ee4",
    secondary: "#b19aeb",
    secondary2: "#ccbff3",

    accent: "#1EB980", // green
    accent2: "#045D56", // dark green
    accent3: "#FF6859", // red
    // accent4: "#f99a07", // orange
    accent4: "#f3d251",
    accent5: "#2fa7f3",


    info: 'gray',
    // warning: '#f3d251', // #FFCF44
    warning: '#f99a07',
    error: '#FF6859',

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