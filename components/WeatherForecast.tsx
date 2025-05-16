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

const WeatherForecast = () => {
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

  const groupForecastByDay = (forecastList: any[]) => {
    if (!forecastList) return [];

    const grouped: Record<string, any> = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });

      if (!grouped[day]) {
        grouped[day] = {
          date: day,
          temps: [],
          conditions: [],
        };
      }

      grouped[day].temps.push(item.main.temp);
      grouped[day].conditions.push(item.weather[0].description);
    });

    return Object.values(grouped)
      .map((day: any) => {
        const avgTemp = day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length;

        const conditionCounts: Record<string, number> = {};
        day.conditions.forEach((cond: string) => {
          conditionCounts[cond] = (conditionCounts[cond] || 0) + 1;
        });

        let mainCondition = '';
        let maxCount = 0;
        Object.entries(conditionCounts).forEach(([cond, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mainCondition = cond;
          }
        });

        return {
          day: day.date,
          avgTemp,
          condition: mainCondition,
        };
      })
      .slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff7f00" />
        <Text style={styles.loadingText}>Loading forecast...</Text>
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

  if (!loading && (!forecastData || !forecastData.list)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>No 5-Day forecast data available</Text>
      </View>
    );
  }

  const dailyForecast = groupForecastByDay(forecastData.list);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Weather Forecast</Text>
      <FlatList
        data={dailyForecast}
        keyExtractor={(item, index) => `${item.day}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftColumn}>
              <Text style={styles.day}>{item.day}</Text>
            </View>
            <View style={styles.rightColumn}>
              <MaterialCommunityIcons
                name={getWeatherIconName(item.condition)}
                size={32}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.temp}>
                {convertTemp(item.avgTemp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
              </Text>
              <Text style={styles.condition}>{item.condition}</Text>
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

export default WeatherForecast;

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
    paddingHorizontal: 10,
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