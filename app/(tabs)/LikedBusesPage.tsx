import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLikedBuses } from "../../components/context/likedBusesContext";
import LikedBusesBusStopComponent from "../../components/main/LikedBusesBusStopComponent";
import { colors, font } from "../../assets/styles/GlobalStyles";

const LikedBusesPage = () => {
  const { likedBuses } = useLikedBuses();

  const groups = Object.entries(likedBuses); // Convert the likedBuses object to an array of [groupName, groupData]

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't liked any buses yet!</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={([groupName]) => groupName}
          renderItem={({ item: [groupName, groupData] }) => (
            <View style={styles.groupContainer}>
              {/* Group Title */}
              <Text style={styles.groupTitle}>{groupName}</Text>

              {/* Display liked buses within this group */}
              {Object.entries(groupData).map(([busStopCode, likedServices]) => (
                <LikedBusesBusStopComponent
                  key={busStopCode}
                  busStopCode={busStopCode}
                  likedBuses={likedServices} // Pass the array of liked service numbers
                />
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.onSurfaceSecondary,
    textAlign: "center",
    marginHorizontal: 20,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.primary,
    marginBottom: 12,
    textTransform: "capitalize",
  },
});

export default LikedBusesPage;
