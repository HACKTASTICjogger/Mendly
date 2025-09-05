import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SecondPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Second Page.</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});

export default SecondPage;
