import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import PayLahComponent from "../../components/main/PayLahComponent";

const { width, height } = Dimensions.get("window");

const App = () => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const boxWidth = 100; // Width of the PayLahComponent
  const boxHeight = 100; // Height of the PayLahComponent

  useEffect(() => {
    const bounceRandomly = () => {
      const getRandomPosition = (max: number, boxSize: number) =>
        Math.random() * (max - boxSize);

      const move = () => {
        x.value = withTiming(getRandomPosition(width, boxWidth), {
          duration: 1000,
          easing: Easing.bounce,
        });
        y.value = withTiming(getRandomPosition(height, boxHeight), {
          duration: 1000,
          easing: Easing.bounce,
        });
      };

      const interval = setInterval(move, 1200); // Change position every 1.2 seconds
      return () => clearInterval(interval);
    };

    bounceRandomly();
  }, [x, y]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.payLahBox, animatedStyle]}>
        <PayLahComponent />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  payLahBox: {
    position: "absolute",
    width: 100,
    height: 100,
  },
});

export default App;
