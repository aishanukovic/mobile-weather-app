import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ForecastState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ForecastState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchForecastData = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  'forecast/fetchForecastData',
  async (location, { rejectWithValue }) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      if (!apiKey) {
        throw new Error('Weather API key is missing');
      }

      const isCoordinates = (location: string) =>
        /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location);
      
      const url = isCoordinates(location)
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${location.split(',')[0]}&lon=${location.split(',')[1]}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
      
      console.log('[Forecast API] Fetching data for:', location);
      console.log('[Forecast API] URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error('[Forecast API] Error fetching data:', err.message);
      return rejectWithValue(err.message || 'Failed to fetch forecast data');
    }
  }
);

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    resetForecast(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecastData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchForecastData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetForecast } = forecastSlice.actions;
export default forecastSlice.reducer;