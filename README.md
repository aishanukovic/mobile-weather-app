# Mobile Weather App

A modern mobile weather forecasting app built with **React Native (Expo)**. Users can search for any city in the world and view the current weather, hourly forecast, 5-day forecast, and weather maps for different conditions such as temperature, wind, clouds, and precipitation.

---

## Features

- Search for cities with autocomplete
- View current weather conditions
- Hourly and 5-day weather forecasts
- Weather maps: temperature, clouds, wind, precipitation
- Geolocation support
- Push notifications (opt-in)
- Clean, responsive UI

---

## Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Expo Router](https://expo.github.io/router/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

---

## Project Structure

```
app/
├── [city]/
   ├── _layout.tsx
   ├── forecast.tsx
   ├── hourly.tsx
   ├── index.tsx
   ├── map.tsx
├── _layout.tsx    
├── index.tsx   
components/
├── HourlyForecast.tsx
├── locationHelpers.ts
├── notifications.ts
├── SearchBar.tsx
├── UnitToggle.tsx
├── WeatherDisplay.tsx
├── WeatherForecast.tsx
components-native/
├── WeatherMap.native.tsx
├── WeatherMap.web.tsx
redux/
├── forecastSlice.ts
├── searchSlice.ts
├── hooks.ts
├── store.ts
├── unitSlice.ts
assets/
├── static files, such as photos
.env                
```

---

## Prerequisites

> Follow each step exactly and you’ll be able to run the app successfully.

### ✅ Install these tools:

1. **Node.js** (v18 or later): [https://nodejs.org](https://nodejs.org)
2. **Git**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
3. **Expo CLI**:
   ```bash
   npm install -g expo-cli
   ```
4. **Expo Go App** on your mobile phone:
   - iOS: App Store → Search for "Expo Go"
   - Android: Google Play → Search for "Expo Go"

---

## How to Set Up the Project (Step-by-Step)

### 1. **Clone the Project**

```bash
git clone https://github.com/your-username/mobile-weather-app.git
cd mobile-weather-app
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Create a `.env` File**

This file stores your secret API key so it’s not hardcoded into the app.

Create a file called `.env` in the root folder and add the following line:

```bash
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

> Replace `your_openweathermap_api_key` with your own API key from [OpenWeatherMap](https://openweathermap.org/appid).

### 4. **Run the Project on Your Device**

Start the Expo development server:

```bash
npx expo start
```

This will open a page in your browser with a QR code.

#### To view the app on your phone:

- Open the **Expo Go** app on your phone
- Scan the QR code from your screen
- The app will launch on your phone!

---

## Troubleshooting

### Problem: “expo-module-scripts/tsconfig.base” not found?

Try updating your `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

If the problem persists, run:

```bash
rm -rf node_modules
npm install
```

---

## .gitignore

Make sure the `.env` file is ignored by Git. Your `.gitignore` should include:

```
.env
node_modules
```

---

## FAQ

### Can I run this app in a browser?

Yes. Expo supports web preview. Run:

```bash
npx expo start --web
```

> Some features like geolocation or push notifications might not work in the browser.

---

## Reset Cache

If you encounter weird behavior:

```bash
npx expo start -c
```