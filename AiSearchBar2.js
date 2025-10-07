import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
// import { Feather } from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

const AISearchBar = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        if (query.trim() === '') return;

        setIsLoading(true);
        setResult(null);
        try {
            // Replace with your actual backend server URL
            const response = await axios.post('https://mendly.vistainfosec.biz/index.php/search', {
                userQuery: query,
            });

            setResult(response.data);

            // Example: Navigate directly if service is recognized
            // if(response.data.service === 'Plumbing') navigation.navigate('PlumbingScreen');
        } catch (error) {
            setResult({ error: "Sorry, I couldn't understand that." });
        } finally {
            setIsLoading(false);
        }
    };

    const startVoiceRecognition = () => {
        // Integrate your voice recognition logic here
        // e.g. setQuery(transcribedVoiceText);
    };

    return (
        <View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#888" />
                <TextInput
                    placeholder="What do you want to fix today?"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={startVoiceRecognition}>
                    <Feather name="mic" size={20} color="#888" />
                </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color="#4CAF50" />}
            {result && (
                <View style={styles.resultContainer}>
                    {result.service && <Text style={styles.resultText}>Detected Service: {result.service}</Text>}
                    {result.issue && <Text style={styles.resultText}>Detected Issue: {result.issue}</Text>}
                    {result.error && <Text style={styles.resultText}>{result.error}</Text>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#26201D',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        color: '#D4C6C0',
        paddingHorizontal: 10,
    },
    resultContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#4A3D36',
        borderRadius: 8,
    },
    resultText: {
        color: '#D4C6C0',
        fontSize: 14,
    },
});

export default AISearchBar;