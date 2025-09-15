import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import Gear80 from './assets/gear_200.svg';
import Gear60 from './assets/gear_120.svg';
import Gear40 from './assets/gear_60.svg';

const AnimatedLargeGear = Animated.createAnimatedComponent(Gear80);
const AnimatedMediumGear = Animated.createAnimatedComponent(Gear60);
const AnimatedSmallGear = Animated.createAnimatedComponent(Gear40);

const App = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spinClockwise = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinCounterClockwise = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.gearsSection}>
        <AnimatedLargeGear
          style={[styles.gear, { transform: [{ rotate: spinClockwise }], width: 96, height: 96 }]}
        />
        <View style={styles.smallGearsRow}>
          <AnimatedSmallGear
            style={[styles.gear, { transform: [{ rotate: spinCounterClockwise }], width: 48, height: 48 }]}
          />
          <AnimatedMediumGear
            style={[styles.gear, { transform: [{ rotate: spinClockwise }], width: 64, height: 64 }]}
          />
        </View>
      </View>

      {/* MENDLY Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.highlight}>M</Text>E<Text style={styles.highlight}>N</Text>DL<Text style={styles.highlight}>Y</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  gearsSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  gear: {
    color: '#fff',
  },
  smallGearsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  logoContainer: {
    position: 'relative',
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 9999,
    paddingHorizontal: 48,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  highlight: {
    color: '#4CAF50',
  },
});

export default App;
