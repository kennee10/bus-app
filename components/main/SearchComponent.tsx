import React from "react";
import { TextInput, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SearchComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchBox}
        // onPress={() => navigation.navigate("SearchPage")}
      >
        <Text style={styles.placeholderText}>Search for a bus stop...</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10
  },
  searchBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholderText: {
    color: "#888",
  },
});

export default SearchComponent;
