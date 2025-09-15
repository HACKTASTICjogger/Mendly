import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, Text, Button, StyleSheet } from 'react-native';

import SplashScreen from './SplashScreen'; // adjust path if needed
import React, { useState, useEffect } from 'react';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Page</Text>
      <Button onPress={() => navigation.navigate('Login')} title="Go to Second Page" />
    </View>
  );
}

import Login from './Login';

const Stack = createNativeStackNavigator();

export default function App() {
    const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash after 3 seconds (change timing as needed)
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  text: { fontSize:24 }
});
