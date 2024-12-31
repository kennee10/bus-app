import React from "react";
import { TextInput, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { containerStyles } from '../../assets/styles/GlobalStyles';
import { scale } from "react-native-size-matters";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={containerStyles.searchContainer}>
      <TouchableOpacity
        style={styles.searchBox}
        // onPress={() => navigation.navigate("SearchPage")}
      >
        <Text style={styles.placeholderText}>Search for a bus stop...</Text>
        <Ionicons
          name={"search"}
          color={"gray"}
          size={scale(20)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: "",
    padding: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholderText: {
    color: "#888",
  },
});

export default SearchComponent;
