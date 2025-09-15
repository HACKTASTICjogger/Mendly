import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox } from 'react-native';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      {/* Branding */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}><Text style={styles.highlight}>MENDLY</Text></Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subHeading}>Welcome! Please fill in the details to sign up.</Text>

      {/* Form inputs */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Terms checkbox */}
      <View style={styles.row}>
        <CheckBox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          tintColors={{ true: '#4CAF50', false: '#fff' }}
        />
        <Text style={styles.rememberText}>
          I agree to the <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={[styles.signupButton, { backgroundColor: agreeTerms ? '#4CAF50' : '#777' }]}
        disabled={!agreeTerms}
        onPress={() => { /* handle signup */ }}
      >
        <Text style={styles.signupButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Link to Login */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 16, paddingTop: 32 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backButtonText: { color: '#fff', fontSize: 24 },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  highlight: {
    color: '#4CAF50',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  rememberText: {
    color: '#fff',
    marginLeft: 8,
  },
  link: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  signupButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 24,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Signup;
