import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Item = {
  key: string;
  label: string;
  backgroundColor: string;
};

const App = () => {
  const [data, setData] = useState<Item[]>([
    { key: "1", label: "Item 1", backgroundColor: "#ffcccc" },
    { key: "2", label: "Item 2", backgroundColor: "#ccffcc" },
    { key: "3", label: "Item 3", backgroundColor: "#ccccff" },
    { key: "4", label: "Item 4", backgroundColor: "#ffffcc" },
  ]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <View
        style={[
          styles.item,
          { backgroundColor: isActive ? "gray" : item.backgroundColor },
        ]}
      >
        <Text
          style={styles.text}
          onLongPress={drag} // Use onLongPress for initiating drag
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => {
          // Safely update the state
          setData(data);
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
