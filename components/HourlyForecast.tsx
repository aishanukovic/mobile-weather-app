import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppSelector } from '../redux/hooks';

const HourlyForecast = () => {
  const { data: forecastData, loading, error } = useAppSelector((state) => state.forecast);
  const { temperatureUnit } = useAppSelector((state) => state.unit);

  const getWeatherIconName = (condition: string) => {
    const main = condition?.toLowerCase();
    if (main.includes('clear')) return 'weather-sunny';
    if (main.includes('cloud')) return 'weather-cloudy';
    if (main.includes('rain') || main.includes('drizzle')) return 'weather-rainy';
    if (main.includes('snow')) return 'weather-snowy';
    if (main.includes('wind')) return 'weather-windy';
    return 'weather-partly-cloudy';
  };

  const convertTemp = (celsius: number) => {
    return temperatureUnit === 'fahrenheit'
      ? Math.round(celsius * 9/5 + 32)
      : Math.round(celsius);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff7f00" />
        <Text style={styles.loadingText}>Loading hourly forecast...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!forecastData || !forecastData.list) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>No hourly forecast available</Text>
      </View>
    );
  }

  const hourlyForecast = forecastData.list.slice(0, 24);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>24-Hour Weather Forecast</Text>
      <FlatList
        data={hourlyForecast}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftColumn}>
              <Text style={styles.day}>{formatTime(item.dt)}</Text>
            </View>
            <View style={styles.rightColumn}>
              <MaterialCommunityIcons
                name={getWeatherIconName(item.weather[0].main)}
                size={32}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.temp}>
                {convertTemp(item.main.temp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
              </Text>
              <Text style={styles.condition}>{item.weather[0].description}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.list}
      />
    </View>
  );
};

export default HourlyForecast;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  cardsContainer: {
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 2,
    alignItems: 'center',
  },
  day: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff7b00',
    textAlign: 'center',
  },
  icon: {
    marginVertical: 8,
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  condition: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  centered: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#888',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
  },
});