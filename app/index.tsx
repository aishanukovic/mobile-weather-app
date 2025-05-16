import { Image } from 'expo-image'; // ✅ for GIF support
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import SearchBar from '../components/SearchBar';
import { clearSuggestions } from '../redux/searchSlice';

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = (city: string) => {
    if (city.trim()) {
      dispatch(clearSuggestions());
      router.push(`/${encodeURIComponent(city)}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔽 GIF Background */}
      <Image
        source={require('../assets/weather-bg.gif')} // replace with your actual GIF file
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        autoplay
      />

      {/* 🔽 Foreground content */}
      <Image
        source={require('../assets/cropped-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.tagline}>
        Easily search the weather conditions in any city around the world directly from your device.
      </Text>

      <SearchBar onSearch={handleSearch} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 10,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
    zIndex: 1,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
    maxWidth: 600,
    fontFamily: 'System',
    zIndex: 1,
  },
});