import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Image,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { reverseGeocodeLabel } from '../../components/locationHelpers';
import {
    cancelNotifications,
    registerForPushNotificationsAsync,
    scheduleDailyForecastNotification,
} from '../../components/notifications';
import SearchBar from '../../components/SearchBar';
import UnitToggle from '../../components/UnitToggle';
import WeatherDisplay from '../../components/WeatherDisplay';
import { fetchForecastData } from '../../redux/forecastSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const CityWeatherScreen = () => {
  const { city } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [bellAnim] = useState(new Animated.Value(1));
  const insets = useSafeAreaInsets();

  const forecastLoading = useAppSelector((state) => state.forecast.loading);

  useEffect(() => {
    if (typeof city === 'string') {
      if (city.startsWith('lat=')) {
        const query = new URLSearchParams(city);
        const lat = query.get('lat');
        const lon = query.get('lon');

        if (lat && lon) {
          dispatch(fetchForecastData(`${lat},${lon}`));
          reverseGeocodeLabel(parseFloat(lat), parseFloat(lon), setLocationLabel);
        }
      } else {
        const cityOnly = city.split(',')[0].trim();
        dispatch(fetchForecastData(cityOnly));
        setLocationLabel(cityOnly);
      }
    }
  }, [city, dispatch]);

  useEffect(() => {
    if (!forecastLoading && city) {
      const askPermission = async () => {
        const granted = await registerForPushNotificationsAsync();
        if (granted) {
          await scheduleDailyForecastNotification();
          setNotificationsEnabled(true);
          Toast.show({
            type: 'success',
            text1: 'Daily notification set for 8:00 AM ✅',
            position: 'bottom',
          });
        }
      };
      askPermission();
    }
  }, [forecastLoading, city]);

  const handleBellToggle = async () => {
    Animated.sequence([
      Animated.timing(bellAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bellAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    if (notificationsEnabled) {
      await cancelNotifications();
      setNotificationsEnabled(false);
      Toast.show({
        type: 'info',
        text1: 'Notifications disabled',
        position: 'bottom',
      });
    } else {
      const granted = await registerForPushNotificationsAsync();
      if (granted) {
        await scheduleDailyForecastNotification();
        setNotificationsEnabled(true);
        Toast.show({
          type: 'success',
          text1: 'Daily notification set for 8:00 AM ✅',
          position: 'bottom',
        });
      }
    }
  };

  const handleSearch = () => {
    const trimmedCity = searchInput.trim();
    if (trimmedCity.length > 0) {
      Keyboard.dismiss();
      router.push(`/${trimmedCity.toLowerCase()}`);
      setSearchInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/weatherly-banner.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={handleBellToggle}
        style={{ position: 'absolute', top: insets.top, right: 16, zIndex: 999 }}
      >
        <Animated.View style={{ transform: [{ scale: bellAnim }] }}>
          <Ionicons
            name={notificationsEnabled ? 'notifications' : 'notifications-off'}
            size={26}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>

      <SearchBar 
        value={searchInput}
        onChangeText={setSearchInput}
        onSearch={handleSearch} 
      />
      
      <WeatherDisplay unitToggle={<UnitToggle />} />
    </SafeAreaView>
  );
};

export default CityWeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  logo: {
    width: 290,
    height: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
});