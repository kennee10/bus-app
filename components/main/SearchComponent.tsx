import React from "react";
import { TextInput, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { scale } from "react-native-size-matters";
import { router } from "expo-router";

const SearchComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => router.push("./search")}
      >
        <Ionicons name={"search"} style={styles.searchIcon}/>
        <Text style={styles.placeholderText}>Search for a bus stop...</Text>
        
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingBottom: scale(10),
    width: scale(340),
    // backgroundColor: 'red'
  },
  searchBox: {
    flexDirection: 'row',
    padding: scale(9),
    borderRadius: scale(10),
    borderWidth: scale(1.3),
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderColor: colors.accent,
  },
  searchIcon: {
    fontSize: scale(20),
    color: colors.accent,
  },
  placeholderText: {
    color: colors.accent,
    fontFamily: font.bold,
    fontSize: scale(12),
    marginLeft: scale(10)
  },
});

export default SearchComponent;
