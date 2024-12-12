import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
    fontFamily: "Courier New",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default GlobalStyles;
