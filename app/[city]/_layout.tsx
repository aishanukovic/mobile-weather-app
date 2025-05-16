import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';

export default function CityLayout() {
  const triggerTabHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // 👈 Light haptic on tab press
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff7f00',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#121212' },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Today' }}
        listeners={{ tabPress: triggerTabHaptic }}
      />
      <Tabs.Screen
        name="hourly"
        options={{ title: 'Hourly' }}
        listeners={{ tabPress: triggerTabHaptic }}
      />
      <Tabs.Screen
        name="forecast"
        options={{ title: '5-Day' }}
        listeners={{ tabPress: triggerTabHaptic }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Weather Maps' }}
        listeners={{ tabPress: triggerTabHaptic }}
      />
    </Tabs>
  );
}