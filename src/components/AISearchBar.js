import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
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
            const response = await axios.post('https://mendly.vistainfosec.biz/index.php/search', {
                userQuery: query,
            });

            setResult(response.data);

        } catch (error) {
            // --- START OF AXIOS FETCH CODE UPDATE ---

            let errorMessage = "Sorry, I couldn't understand that.";

            // Check if the error is from Axios and has a server response
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx (e.g., 400, 500)
                console.log("Server Response Error Status:", error.response.status);
                console.log("Server Response Data:", error.response.data);
                
                // Check for a specific error message returned by your PHP backend
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    // Default message using the status code
                    errorMessage = `Server Error (${error.response.status}): Check logs.`;
                }
            } else if (error.request) {
                // The request was made but no response was received (e.g., network timeout)
                console.log("No Server Response Error:", error.request);
                errorMessage = "Network Error: Cannot connect to server.";
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Request Setup Error:", error.message);
                errorMessage = `Request Error: ${error.message}`;
            }

            setResult({ error: errorMessage });
            
            // --- END OF AXIOS FETCH CODE UPDATE ---
            
        } finally {
            setIsLoading(false);
        }
    };

    // New function to clear the input and results
    const clearSearch = () => {
        setQuery('');
        setResult(null);
    };

    const startVoiceRecognition = () => {
        // Integrate your voice recognition logic here
        // e.g. setQuery(transcribedVoiceText);
    };

    return (
        <View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#888" style={styles.iconMargin} />
                <TextInput
                    placeholder="What do you want to fix today?"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                
                {/* 1. Add the clear button, visible only if there is text in the query */}
                {query.length > 0 && !isLoading && (
                    <TouchableOpacity onPress={clearSearch} style={styles.iconMargin}>
                        <Feather name="x-circle" size={20} color="#888" />
                    </TouchableOpacity>
                )}

                {/* 2. Voice Recognition Button */}
                {!isLoading && (
                    <TouchableOpacity onPress={startVoiceRecognition}>
                        <Feather name="mic" size={20} color="#888" />
                    </TouchableOpacity>
                )}

                {/* 3. Loading indicator (optional, but good practice to show where the mic/clear button would be) */}
                {isLoading && <ActivityIndicator size="small" color="#4CAF50" />}
            </View>

            {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color="#4CAF50" />}
            
            {/* 4. Display the result block */}
            {result && (
                <View style={styles.resultContainer}>
                    {result.service && <Text style={styles.resultText}>Detected Service: {result.service}</Text>}
                    {result.issue && <Text style={styles.resultText}>Detected Issue: {result.issue}</Text>}
                     {result.solution && <Text style={styles.resultText}>Solution: {result.solution}</Text>}
                    {result.error && <Text style={styles.resultText}>{result.error}</Text>}
                </View>
            )}
        </View>
    );
};

// Updated Styles
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
        // Removed original right padding to manage icons with margins
    },
    iconMargin: {
        marginRight: 8, // Add spacing between icons
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