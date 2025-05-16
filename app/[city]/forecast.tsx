import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherForecast from '../../components/WeatherForecast';
import { fetchForecastData } from '../../redux/forecastSlice';
import { useAppDispatch } from '../../redux/hooks';

const ForecastScreen = () => {
  const { city } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof city === 'string') {
      const cityOnly = city.split(',')[0].trim();
      dispatch(fetchForecastData(cityOnly));
    }
  }, [city, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <WeatherForecast />
    </SafeAreaView>
  );
};

export default ForecastScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});