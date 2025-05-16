import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        Alert.alert('Permission Denied', 'Location access is required.');
      }, 50); // Slight delay ensures haptic isn't suppressed by alert
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode with OpenWeather');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const { name, country } = data[0];
      return `${name}, ${country}`;
    }

    return null;
  } catch (error) {
    console.error('[reverseGeocode] Error:', error);
    return null;
  }
};

export const reverseGeocodeLabel = async (
  latitude: number,
  longitude: number,
  setLabel: (label: string) => void
) => {
  try {
    const label = await reverseGeocode(latitude, longitude);
    if (label) setLabel(label);
  } catch (error) {
    console.error('[reverseGeocodeLabel] Error setting label:', error);
  }
};