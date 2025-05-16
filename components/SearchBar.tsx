import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  clearSuggestions,
  fetchLocationSuggestions,
  setQuery,
} from '../redux/searchSlice';
import { getCurrentLocation } from './locationHelpers'; // ✅ NEW

type Props = {
  onSearch?: (city: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { query, suggestions, highlightedIndex, error, loading } = useAppSelector(
    (state) => state.search
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
    dispatch(setQuery(text));
    setValidationError(null);

    if (text.trim().length > 1) {
      dispatch(fetchLocationSuggestions(text));
    } else {
      dispatch(clearSuggestions());
    }
  };

  const validateAndSearch = (city: string) => {
    if (!city || city.trim().length === 0) {
      setValidationError('Please enter a city name');
      return false;
    }
    if (!/^[a-zA-Z\s,.'-]+$/.test(city)) {
      setValidationError('Please enter a valid city name');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSelectLocation = (city: string) => {
    dispatch(setQuery(city));
    dispatch(clearSuggestions());

    if (validateAndSearch(city)) {
      redirectToCity(city);
    }
  };

  const handleSearchButtonClick = () => {
    if (validateAndSearch(query)) {
      redirectToCity(query);
    }
  };

  const redirectToCity = (input: string | { lat: number; lon: number }) => {
    dispatch(setQuery(''));
    dispatch(clearSuggestions());
    setValidationError(null);
  
    if (typeof input === 'string') {
      const trimmed = input.trim().toLowerCase();
      router.push(`/${trimmed}`);
    } else {
      const { lat, lon } = input;
      router.push(`/${encodeURIComponent(`lat=${lat}&lon=${lon}`)}`);
    }
  };

  const handleClearInput = () => {
    dispatch(setQuery(''));
    dispatch(clearSuggestions());
    setValidationError(null);
  };

  const handleUseMyLocation = async () => {
    const coords = await getCurrentLocation();
  
    if (coords) {
      const { latitude, longitude } = coords;
      redirectToCity({ lat: latitude, lon: longitude });
    } else {
      Alert.alert('Error', 'Could not determine location.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter city name..."
              value={query}
              onChangeText={handleInputChange}
              placeholderTextColor="#666"
            />
            {query.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearInput}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
          <Pressable
            style={styles.button}
            onPress={handleSearchButtonClick}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.button, styles.locationButton]}
          onPress={handleUseMyLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Use My Location</Text>
        </Pressable>

        {validationError && <Text style={styles.error}>{validationError}</Text>}
        {error && !validationError && <Text style={styles.error}>Error: {error}</Text>}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <Pressable
                style={[
                  styles.suggestionItem,
                  index === highlightedIndex && styles.highlightedSuggestion,
                ]}
                onPress={() => handleSelectLocation(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    width: '86%',
    maxWidth: 500,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 10,
  },
  container: {
    zIndex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderColor: '#ff7f00',
    borderWidth: 2,
    fontSize: 16,
    color: '#333',
    paddingRight: 35,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  button: {
    backgroundColor: '#ff7f00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  locationButton: {
    backgroundColor: '#444', // optional: style differently
    width: '50%',
    alignSelf: 'center',
    position: 'relative',
    paddingVertical: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#ffcccc',
    marginTop: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    maxHeight: 200,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,
  },
  suggestionItem: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  suggestionText: {
    color: '#333',
  },
  highlightedSuggestion: {
    backgroundColor: '#ffa500',
  },
});