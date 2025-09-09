import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';

const gearPaths = [
  // You can get SVG path data for gears from a vector editor or online resource
  // For demonstration, these are simple circle gears; replace with gear SVGs for real use
  <Circle cx="40" cy="40" r="32" stroke="white" strokeWidth="8" fill="none" />,
  <Circle cx="30" cy="30" r="20" stroke="white" strokeWidth="8" fill="none" />,
  <Circle cx="50" cy="50" r="15" stroke="white" strokeWidth="8" fill="none" />,
];

export default function SplashScreen() {
  // Create three animated values for gear rotation
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const rotate3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Infinite looping animations
    Animated.loop(
      Animated.timing(rotate1, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(rotate2, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(rotate3, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate for spinning animation
  const spin1 = rotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const spin2 = rotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const spin3 = rotate3.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.gearsRow}>
        <Animated.View style={{ ...styles.gear, transform: [{ rotate: spin1 }, { translateY: -30 }, { translateX: 30 }] }}>
          <Svg width={80} height={80}>{gearPaths[0]}</Svg>
        </Animated.View>
        <Animated.View style={{ ...styles.gear, transform: [{ rotate: spin2 }, { translateY: 0 }, { translateX: -10 }] }}>
          <Svg width={60} height={60}>{gearPaths[1]}</Svg>
        </Animated.View>
        <Animated.View style={{ ...styles.gear, transform: [{ rotate: spin3 }, { translateY: 30 }, { translateX: 40 }] }}>
          <Svg width={40} height={40}>{gearPaths[2]}</Svg>
        </Animated.View>
      </View>
      <View style={styles.logoShadow}>
        <Text style={styles.logoText}>
          <Text style={styles.logoBlue}>MEN</Text>
          <Text style={styles.logoWhite}>DLY</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  gearsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 60,
    marginLeft: 20,
  },
  gear: {
    margin: 10,
  },
  logoShadow: {
    backgroundColor: "#585858",
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 3,
    textAlign: "center",
  },
  logoBlue: {
    color: "#8bddfd",
  },
  logoWhite: {
    color: "#fff",
  },
  motionText: {
    color: "#fff",
    fontSize: 15,
    position: "absolute",
    top: 20,
    left: 0,
    letterSpacing: 1,
  },
});
