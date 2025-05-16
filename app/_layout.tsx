import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}