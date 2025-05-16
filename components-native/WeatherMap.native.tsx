import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../redux/hooks';

const WeatherMap = () => {
  const forecastData = useAppSelector((state) => state.forecast.data);
  const [mapComponents, setMapComponents] = useState<any | null>(null);
  const [mapType, setMapType] = useState('temp_new');

  const mapTypes = [
    { value: 'temp_new', label: 'Temperature' },
    { value: 'precipitation_new', label: 'Precipitation' },
    { value: 'clouds_new', label: 'Clouds' },
    { value: 'wind_new', label: 'Wind' },
  ];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const maps = await import('react-native-maps');
        setMapComponents({
          MapView: maps.default,
          Marker: maps.Marker,
          PROVIDER_GOOGLE: maps.PROVIDER_GOOGLE,
          UrlTile: maps.UrlTile,
        });
      })();
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Weather map is only available on iOS and Android.</Text>
      </View>
    );
  }

  if (!mapComponents || !forecastData?.city?.coord) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Loading map...</Text>
      </View>
    );
  }

  const { MapView, Marker, UrlTile, PROVIDER_GOOGLE } = mapComponents;
  const { lat, lon } = forecastData.city.coord;

  // Generate a unique key for the UrlTile to force re-render when mapType changes
  const tileKey = `map-tile-${mapType}-${Date.now()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Map</Text>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lon }}
          title={forecastData.city.name}
          description={`Country: ${forecastData.city.country}`}
        />
        <UrlTile
          key={tileKey}
          urlTemplate={`https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}`}
          zIndex={1}
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />
      </MapView>

      <View style={styles.buttonRow}>
        {mapTypes.map((type) => (
          <Text
            key={type.value}
            style={[styles.button, mapType === type.value && styles.activeButton]}
            onPress={() => setMapType(type.value)}
          >
            {type.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default WeatherMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 600,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    color: '#333',
    borderRadius: 6,
    fontSize: 14,
    margin: 4,
  },
  activeButton: {
    backgroundColor: '#ff7b00',
    color: 'white',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
});