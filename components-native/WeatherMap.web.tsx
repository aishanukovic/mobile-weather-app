import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WeatherMap = () => (
  <View style={styles.container}>
    <Text style={styles.text}>
      Weather maps are not available on web.
    </Text>
  </View>
);

export default WeatherMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
});