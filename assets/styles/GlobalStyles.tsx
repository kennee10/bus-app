import { StyleSheet } from "react-native";

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
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 16,
      color: "red",
      textAlign: "center",
    },
  });