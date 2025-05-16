import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleTemperatureUnit } from '../redux/unitSlice';

const UnitToggle = () => {
  const dispatch = useAppDispatch();
  const { temperatureUnit } = useAppSelector((state) => state.unit);

  const isFahrenheit = temperatureUnit === 'fahrenheit';

  const handleToggle = () => {
    Haptics.selectionAsync();
    dispatch(toggleTemperatureUnit());
  };

  return (
    <View style={styles.toggleContainer}>
      <Text style={[styles.unitLabel, !isFahrenheit && styles.active]}>°C</Text>
      <Switch
        trackColor={{ false: '#ccc', true: '#ff7f00' }}
        thumbColor="#fff"
        ios_backgroundColor="#ccc"
        onValueChange={handleToggle}
        value={isFahrenheit}
      />
      <Text style={[styles.unitLabel, isFahrenheit && styles.active]}>°F</Text>
    </View>
  );
};

export default UnitToggle;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    gap: 10,
  },
  unitLabel: {
    fontSize: 16,
    color: '#888',
  },
  active: {
    color: '#ff7f00',
    fontWeight: 'bold',
  },
});