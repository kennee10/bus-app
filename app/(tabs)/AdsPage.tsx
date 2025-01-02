import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";

const App = () => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the scroll animation
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -250, // Adjust this to scroll the text fully off-screen
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.View
          style={[
            styles.animatedText,
            {
              transform: [{ translateX: scrollAnim }],
            },
          ]}
        >
          <Text style={styles.text}>
            This is a long text that will overflow and scroll.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    width: 250, // Container width should be wide enough for the text to overflow and scroll
    backgroundColor: 'lightblue',
    overflow: "hidden",
  },
  animatedText: {
    flexDirection: "row",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
