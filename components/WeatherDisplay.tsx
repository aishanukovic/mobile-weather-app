import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAppSelector } from '../redux/hooks';

const WeatherDisplay = ({ unitToggle }: { unitToggle: React.ReactNode }) => {
  const forecast = useAppSelector((state) => state.forecast);
  const unit = useAppSelector((state) => state.unit);

  const convertTemp = (celsius: number) => {
    return unit.temperatureUnit === 'fahrenheit'
      ? ((celsius * 9) / 5 + 32).toFixed(1)
      : celsius.toFixed(1);
  };

  const getWeatherIconName = (condition: string) => {
    const main = condition?.toLowerCase();
    if (main.includes('clear')) return 'weather-sunny';
    if (main.includes('cloud')) return 'weather-cloudy';
    if (main.includes('rain') || main.includes('drizzle')) return 'weather-rainy';
    if (main.includes('snow')) return 'weather-snowy';
    if (main.includes('wind')) return 'weather-windy';
    return 'weather-partly-cloudy';
  };

  if (forecast.loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff7f00" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (forecast.error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {forecast.error}</Text>
      </View>
    );
  }

  if (!forecast.data || !forecast.data.list?.[0]) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>No weather data available.</Text>
      </View>
    );
  }

  const d = forecast.data.list[0]; // closest forecast (used for "Today")
  const city = forecast.data.city;

  const formatted = {
    temperature: convertTemp(d.main.temp),
    feelsLike: convertTemp(d.main.feels_like),
    pressure: d.main.pressure,
    visibility: (d.visibility ?? 10000) / 1000,
    cloudiness: d.clouds.all,
    sunrise: new Date(city.sunrise * 1000).toLocaleTimeString(),
    sunset: new Date(city.sunset * 1000).toLocaleTimeString(),
    condition: d.weather[0].description,
    windSpeed: d.wind.speed,
    humidity: d.main.humidity,
    country: city.country,
    city: city.name,
  };

  const stats = [
    { label: 'Temperature', value: `${formatted.temperature}°${unit.temperatureUnit === 'celsius' ? 'C' : 'F'}` },
    { label: 'Feels Like', value: `${formatted.feelsLike}°${unit.temperatureUnit === 'celsius' ? 'C' : 'F'}` },
    { label: 'Condition', value: formatted.condition },
    { label: 'Visibility', value: `${formatted.visibility.toFixed(1)} km` },
    { label: 'Cloudiness', value: `${formatted.cloudiness}%` },
    { label: 'Sunrise', value: formatted.sunrise },
    { label: 'Sunset', value: formatted.sunset },
    { label: 'Pressure', value: `${formatted.pressure} hPa` },
    { label: 'Wind', value: `${formatted.windSpeed} km/h` },
    { label: 'Humidity', value: `${formatted.humidity}%` },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.whitePanel}>
        <View style={styles.header}>
          <View style={styles.cityWrapper}>
            <MaterialCommunityIcons
              name={getWeatherIconName(formatted.condition)}
              size={48}
              color="#ff7f00"
            />
            <Text style={styles.location}>
              {formatted.city}, {formatted.country}
            </Text>
          </View>
          <View>{unitToggle}</View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default WeatherDisplay;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  whitePanel: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    minHeight: height * 0.7,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 24,
    color: '#ff7f00',
    fontWeight: '600',
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    width: 180,
    margin: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#ff7f00',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    color: '#333',
  },
  centered: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 10,
  },
});