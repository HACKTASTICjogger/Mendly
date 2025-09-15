import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Gear80 from './assets/gear_320.svg';
import Gear60 from './assets/gear_200.svg';
import Gear40 from './assets/gear_120.svg';

const AnimatedLargeGear = Animated.createAnimatedComponent(Gear80);
const AnimatedMediumGear = Animated.createAnimatedComponent(Gear60);
const AnimatedSmallGear = Animated.createAnimatedComponent(Gear40);

export default function SplashScreen() {
  const rotate1 = useRef(new Animated.Value(0)).current;
  const orbit1 = useRef(new Animated.Value(0)).current;

  const rotate2 = useRef(new Animated.Value(0)).current;
  const orbit2 = useRef(new Animated.Value(0)).current;

  const rotate3 = useRef(new Animated.Value(0)).current;
  const orbit3 = useRef(new Animated.Value(0)).current;

  // State for actual position
  const [pos1, setPos1] = useState({ x: 0, y: 0 });
  const [pos2, setPos2] = useState({ x: 0, y: 0 });
  const [pos3, setPos3] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Spinning animations
    Animated.loop(Animated.timing(rotate1, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
    Animated.loop(Animated.timing(rotate2, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();
    Animated.loop(Animated.timing(rotate3, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();

    // Orbiting animations (loop from 0 to 2π radians)
    Animated.loop(Animated.timing(orbit1, {
      toValue: 2 * Math.PI,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false, // This must be false for listeners
    })).start();
    Animated.loop(Animated.timing(orbit2, {
      toValue: 2 * Math.PI,
      duration: 3200,
      easing: Easing.linear,
      useNativeDriver: false,
    })).start();
    Animated.loop(Animated.timing(orbit3, {
      toValue: 2 * Math.PI,
      duration: 2600,
      easing: Easing.linear,
      useNativeDriver: false,
    })).start();

    // Orbit listeners to update gear position
    const radius1 = 70, radius2 = 40, radius3 = 18;
    const center = { x: 0, y: 0 }; // relative offsets can be adjusted

    // Large gear motion
    orbit1.addListener(({ value }) => {
      setPos1({
        x: center.x + radius1 * Math.cos(value),
        y: center.y + radius1 * Math.sin(value)
      });
    });
    // Medium gear motion
    orbit2.addListener(({ value }) => {
      setPos2({
        x: center.x + radius2 * Math.cos(value + Math.PI / 2), // phase offset
        y: center.y + radius2 * Math.sin(value + Math.PI / 2)
      });
    });
    // Small gear motion
    orbit3.addListener(({ value }) => {
      setPos3({
        x: center.x + radius3 * Math.cos(value + Math.PI), // phase offset
        y: center.y + radius3 * Math.sin(value + Math.PI)
      });
    });

    // Cleanup listeners
    return () => {
      orbit1.removeAllListeners();
      orbit2.removeAllListeners();
      orbit3.removeAllListeners();
    };
  }, []);

  const spin1 = rotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin2 = rotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin3 = rotate3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.gearsArea}>
        <AnimatedLargeGear
          style={{
            width: 200,
            height: 200,
            position: 'absolute',
            top: 120 + pos1.y,
            left: 120 + pos1.x,
            transform: [{ rotate: spin2 }]
          }}
        />
        <AnimatedMediumGear
          style={{
            width: 60,
            height: 60,
            position: 'absolute',
            top: 170 + pos2.y,
            left: 170 + pos2.x,
            transform: [{ rotate: spin3 }]
          }}
        />
        <AnimatedSmallGear
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: 220 + pos3.y,
            left: 220 + pos3.x,
            transform: [{ rotate: spin1 }]
          }}
        />
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
  gearsArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 330,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
  },
  logoShadow: {
    position: "absolute",
    bottom: 38,
    backgroundColor: "#585858",
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 60,
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
});
