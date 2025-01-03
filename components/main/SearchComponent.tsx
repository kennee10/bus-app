import React from "react";
import { TextInput, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { colors, containerStyles, font } from '../../assets/styles/GlobalStyles';
import { scale } from "react-native-size-matters";
import { router } from "expo-router";

const SearchComponent = () => {

  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => router.push("/(tabs)/SearchPage")}
      activeOpacity={1} // Prevents "TouchableOpacity" feedback
    >
      <Ionicons name={"search"} style={styles.searchIcon}/>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a bus stop..."
        placeholderTextColor={colors.accent}
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: scale(4),
    marginBottom: scale(10),
    borderRadius: scale(10),
    borderWidth: scale(1.3),
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderColor: colors.accent,
  },
  searchIcon: {
    fontSize: scale(20),
    paddingLeft: scale(5),
    color: colors.accent,
  },
  searchInput: {
    flex: 1,
    color: colors.accent,
    fontFamily: font.bold,
    fontSize: scale(12),
    marginLeft: scale(10),
  }
});

export default SearchComponent;
