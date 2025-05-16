import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HourlyForecast from '../../components/HourlyForecast';
import { useAppDispatch } from '../../redux/hooks';
import { fetchForecastData } from '../../redux/forecastSlice';

const HourlyScreen = () => {
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
      <HourlyForecast />
    </SafeAreaView>
  );
};

export default HourlyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
});