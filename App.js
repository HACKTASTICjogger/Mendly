import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
// import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AISearchBar from './src/components/AISearchBar';
import SplashScreen from './SplashScreen';
import Login from './Login';
import Signup from './Sign';

const GOOGLE_VISION_API_KEY = 'AIzaSyAIGV0hw-XRHhxgy8aQIBUV_in8YWrChzc'; // Replace!

const modelCards = [
  {
    title: 'Shower Head Model',
    problem: 'Low water pressure',
    imageUrl: 'https://placehold.co/150x150?text=Shower+Head',
  },
  {
    title: 'Faucet Model',
    problem: 'Leakage problem',
    imageUrl: 'https://placehold.co/150x150?text=Faucet',
  },
  {
    title: 'Ceiling Fan Model',
    problem: 'Noise when running',
    imageUrl: 'https://placehold.co/150x150?text=Ceiling+Fan',
  },
  {
    title: 'Appliance Model',
    problem: 'Not switching on',
    imageUrl: 'https://placehold.co/150x150?text=Appliance',
  },
  {
    title: 'TV Model',
    problem: 'Picture flickering',
    imageUrl: 'https://placehold.co/150x150?text=TV',
  },
];

const userIcons = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'user',
  icon: '👤',
}));

const featuredServices = [
  { title: 'Plumbing', description: 'Fix leaks and pipe issues', icon: '🔧' },
  { title: 'Electrical', description: 'Lighting and wiring repairs', icon: '⚡' },
  { title: 'Appliance Repair', description: 'Repair home appliances', icon: '🔌' },
  { title: 'Home Cleaning', description: 'Deep cleaning services', icon: '🧹' },
];

const faqs = [
  {
    question: 'How to book a service?',
    answer: 'Use the search bar or browse services to book easily.',
  },
  {
    question: 'Are technicians certified?',
    answer: 'Yes, all technicians are certified professionals.',
  },
  {
    question: 'What is service warranty?',
    answer: 'Services come with a 30-day warranty period.',
  },
];

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [reviewVisible, setReviewVisible] = useState(false);

  // AI scan state
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReviewVisible(!!hoveredUser);
  }, [hoveredUser]);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setProfileMenuVisible(false);
    }
  };

  // Image Picker using react-native-image-picker
  const pickImage = () => {
    setLoading(true);
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      async (response) => {
        if (response.didCancel) {
          setLoading(false);
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          setLoading(false);
          Alert.alert('Error', response.errorMessage || 'Unknown error');
        } else if (response.assets && response.assets.length > 0) {
          // Get the image uri
          const uri = response.assets[0].uri;
          await analyzeImage(uri);
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert('Error', 'Failed to pick image.');
        }
      }
    );
  };

  // Google Vision API function remains similar
  const analyzeImage = async (imageUri) => {
    // 1. API Key Check (Retained)
    if (!GOOGLE_VISION_API_KEY || GOOGLE_VISION_API_KEY === 'YOUR_GOOGLE_CLOUD_VISION_API_KEY') {
        Alert.alert('API Key Missing', 'Please set your actual Google Cloud Vision API key.');
        return;
    }

    try {
        // 2. Read Image and Base64 Conversion
        const base64ImageData = await RNFS.readFile(imageUri, 'base64');
        
        // **--- ADDED: Base64 Sanity Check ---**
        if (!base64ImageData || base64ImageData.length < 100) {
            // A short Base64 string indicates a file reading issue.
            throw new Error("Base64 conversion failed or resulted in a very small file.");
        }
        
        // 3. Construct API Request (Correct)
        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;
        const requestData = {
            requests: [
                {
                    image: { content: base64ImageData },
                    features: [{ type: 'LABEL_DETECTION', maxResults: 3 }],
                },
            ],
        };

        // 4. Send POST Request (Correct)
        const response = await axios.post(apiUrl, requestData, {
             headers: {
                 'Content-Type': 'application/json', // Explicitly set header
             },
             timeout: 15000 // Set a timeout for the request (15 seconds)
        });

        // 5. Handle Successful Response (Correct)
        const responseData = response.data.responses[0];
        const labels = responseData.labelAnnotations;

        if (labels && labels.length > 0) {
            const topLabel = labels[0].description;
            Alert.alert('Product Identified!', `Identified: ${topLabel}`);
            setSearchText(topLabel);
        } else {
            Alert.alert('No Product Found', 'Try again with a clearer image or a different angle.');
        }

    } catch (error) {
        // **--- MODIFIED: Enhanced Error Logging ---**
        let errorMessage = 'Failed to connect to the analysis service.';
        
        if (error.response) {
            // Error response from the Vision API server (e.g., 400, 403, 500)
            const apiError = error.response.data.error;
            console.error("Vision API responded with an error:", apiError);

            if (apiError && apiError.message) {
                // Use the Google API's error message if available
                errorMessage = apiError.message;
            } else {
                // Fallback for general HTTP errors
                errorMessage = `API Request failed with status ${error.response.status}. Check API Key/Billing/Restrictions.`;
            }
        } else if (error.message) {
            // Network error (timeout, connectivity) or custom error (Base64 check)
            console.error("Network or Client Error:", error.message);
            errorMessage = `Network Error: ${error.message}. Check your internet connection.`;
        }

        Alert.alert('Analysis Error', errorMessage);
    }
};

  return (
    <View style={styles.appContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>HELLO, (NAME)</Text>
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => setProfileMenuVisible((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
        {isProfileMenuVisible && (
          <View style={styles.profileMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setProfileMenuVisible(false)}>
              <Text style={styles.menuItemText}>My Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setProfileMenuVisible(false)}>
              <Text style={styles.menuItemText}>Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setProfileMenuVisible(false)}>
              <Text style={styles.menuItemText}>Upgrade to Pro</Text>
            </TouchableOpacity>
            {!isLoggedIn ? (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setProfileMenuVisible(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.menuItemText}>Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.menuItem} onPress={handleLoginLogout}>
                <Text style={styles.menuItemText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* AI Search Bar + Scan Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <AISearchBar navigation={navigation} value={searchText} onChangeText={setSearchText} />
          </View>
          <TouchableOpacity
            style={{
              marginLeft: 8,
              width: 48,
              height: 48,
              borderRadius: 10,
              backgroundColor: '#4A3D36',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={pickImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#D4C6C0" />
            ) : (
              <Text style={{ fontSize: 22, color: '#D4C6C0' }}>📷</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSearches}>
          <Text style={styles.recentSearchesText}>Most Searches</Text>
        </View>

        {/* Model Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScrollView}>
          {modelCards.map((card, idx) => (
            <View key={idx} style={styles.card}>
              <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardProblem}>{card.problem}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Featured Services */}
        <Text style={styles.sectionTitle}>Featured Services</Text>
        <View style={styles.servicesContainer}>
          {featuredServices.map((service, idx) => (
            <View key={idx} style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDesc}>{service.description}</Text>
            </View>
          ))}
        </View>

        {/* User Icons */}
        <Text style={[styles.scrollText, styles.userIconText]}>
          (putting cursor on the person's icon, the icon rises a little and review fades in, scrollable ➔)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userIconScrollView}>
          {userIcons.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userIconContainer}
              onPressIn={() => setHoveredUser(user.id)}
              onPressOut={() => setHoveredUser(null)}
            >
              <Text style={styles.userIcon}>{user.icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Review Box */}
        {reviewVisible && <View style={styles.reviewBox} />}

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>FAQs & Tips</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq, idx) => (
            <View key={idx} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
              <Text style={styles.faqAnswer}>A: {faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Sponsor Brand */}
        <View style={styles.sponsorContainer}>
          <TouchableOpacity style={styles.sponsorButton}>
            <Text style={styles.sponsorButtonText}>(sponsors brand)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setSplashVisible(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#332924',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: '#26201D',
    position: 'relative',
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4C6C0',
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2D6D3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  profileIcon: {
    fontSize: 28,
    color: '#6135A6',
  },

  profileMenu: {
    position: 'absolute',
    top: 80,
    right: 24,
    backgroundColor: '#4A3D36',
    borderRadius: 12,
    paddingVertical: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#D4C6C0',
  },
  menuItemText: {
    color: '#D4C6C0',
    fontSize: 16,
  },

  scrollContainer: {
    padding: 24,
    paddingTop: 16,
  },

  searchBarContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26201D',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    color: '#D4C6C0',
  },
  searchInput: {
    flex: 1,
    color: '#D4C6C0',
    paddingHorizontal: 10,
  },
  micIcon: {
    fontSize: 16,
    color: '#D4C6C0',
  },

  recentSearches: {
    marginBottom: 10,
    alignItems: 'center',
  },
  recentSearchesText: {
    color: '#D4C6C0',
    fontSize: 14,
  },

  cardScrollView: {
    paddingHorizontal: -24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  card: {
    backgroundColor: '#D4C6C0',
    borderRadius: 20,
    width: 160,
    height: 256,
    marginRight: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: 96,
    height: 96,
    marginBottom: 12,
    borderRadius: 8,
  },
  cardTitle: {
    color: '#332924',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardProblem: {
    color: '#332924',
    fontSize: 14,
  },

  sectionTitle: {
    marginTop: 32,
    color: '#D4C6C0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: '#4A3D36',
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 10,
    color: '#D4C6C0',
  },
  serviceTitle: {
    color: '#D4C6C0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDesc: {
    color: '#B0A899',
    fontSize: 14,
  },

  userIconText: {
    marginTop: 16,
    marginBottom: 16,
  },
  userIconScrollView: {
    flexGrow: 0,
    marginBottom: 20,
  },
  userIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    backgroundColor: '#26201D',
    borderRadius: 32,
    marginHorizontal: 4,
  },
  userIcon: {
    fontSize: 32,
    color: '#D4C6C0',
  },

  reviewBox: {
    backgroundColor: '#D4C6C0',
    height: 96,
    width: '100%',
    borderRadius: 16,
    marginTop: 16,
    alignSelf: 'center',
  },

  faqContainer: {
    backgroundColor: '#4A3D36',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    color: '#D4C6C0',
    fontWeight: '600',
    marginBottom: 2,
  },
  faqAnswer: {
    color: '#B0A899',
    fontSize: 14,
  },

  sponsorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  sponsorButton: {
    backgroundColor: '#4A3D36',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: 128,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sponsorButtonText: {
    color: '#D4C6C0',
    textAlign: 'center',
    fontSize: 12,
  },
});
