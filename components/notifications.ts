import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';

export const registerForPushNotificationsAsync = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    Alert.alert('Must use a physical device for push notifications.');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission denied for notifications');
    return false;
  }

  return true;
};

export const scheduleDailyForecastNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌤️ Today\'s Forecast',
      body: 'Check out the latest weather in Weatherly!',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
      type: 'calendar',
    },
  });
};

export const cancelNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};