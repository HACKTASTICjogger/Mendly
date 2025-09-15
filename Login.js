import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const GEAR_PATH = "M78.6,21.4c-4.4-4.4-9.9-7.9-16.1-10.4C59.9,8.5,55,7,50,7s-9.9,1.5-12.5,4c-6.2,2.5-11.7,6-16.1,10.4C16,25.8,12.5,31.3,10.4,37.5C7.9,40.1,7,45,7,50s1.5,9.9,4,12.5c2.5,6.2,6,11.7,10.4,16.1C25.8,84,31.3,87.5,37.5,89.6C40.1,92.1,45,93,50,93s9.9-1.5,12.5-4c6.2-2.5,11.7-6,16.1-10.4C84,74.2,87.5,68.7,89.6,62.5C92.1,59.9,93,55,93,50s-1.5-9.9-4-12.5C86.5,31.3,83,25.8,78.6,21.4z M50,75c-13.8,0-25-11.2-25-25s11.2-25,25-25s25,11.2,25,25S63.8,75,50,75z M50,55c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S47.2,55,50,55z";

const Login = ({ navigation }) => {
  // const navigation = useNavigation();
  const spinValue1 = useRef(new Animated.Value(0)).current;
  const spinValue2 = useRef(new Animated.Value(0)).current;
  const spinValue3 = useRef(new Animated.Value(0)).current;

  // Start the gear rotation animations
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue1, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.timing(spinValue2, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.timing(spinValue3, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate the spin values to create rotation strings
  const spin1 = spinValue1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin2 = spinValue2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const spin3 = spinValue3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Gears Section */}
        <View style={styles.gearsContainer}>
          {/* Large Gear */}
          <Animated.View style={[styles.gear, styles.largeGear, { transform: [{ rotate: spin1 }] }]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Path fill="#fff" d={GEAR_PATH} />
            </Svg>
          </Animated.View>
          <View style={styles.smallGearsRow}>
            {/* Small Gear */}
            <Animated.View style={[styles.gear, styles.smallGear, { transform: [{ rotate: spin2 }] }]}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Path fill="#fff" d={GEAR_PATH} />
              </Svg>
            </Animated.View>
            {/* Medium Gear */}
            <Animated.View style={[styles.gear, styles.mediumGear, { transform: [{ rotate: spin3 }] }]}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Path fill="#fff" d={GEAR_PATH} />
              </Svg>
            </Animated.View>
          </View>
        </View>

        {/* MENDLY Logo Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.highlight}>M</Text>E<Text style={styles.highlight}>N</Text>DL<Text style={styles.highlight}>Y</Text>
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Login to your Account</Text>
          <Text style={styles.subHeading}>Welcome back! Please enter your details.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
          />

          <View style={styles.formRow}>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}></View>
              <Text style={styles.checkboxText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
         <Text style={styles.signupText}>
      Don't have an account?{' '}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
        <Text style={styles.linkText}>Sign Up</Text>
      </TouchableOpacity>
    </Text>
        </View>
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
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  gearsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gear: {
    color: '#fff',
  },
  largeGear: {
    width: 96,
    height: 96,
  },
  smallGear: {
    width: 48,
    height: 48,
  },
  mediumGear: {
    width: 64,
    height: 64,
  },
  smallGearsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
    alignItems: 'flex-end',
  },
  logoContainer: {
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 9999,
    paddingVertical: 18,
    paddingHorizontal: 36,
    marginTop: 32,
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#fff',
  },
  subHeading: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 8,
  },
  checkboxText: {
    color: '#fff',
  },
  linkText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});

export default Login;
