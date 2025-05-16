import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  query: string;
  suggestions: string[];
  highlightedIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  suggestions: [],
  highlightedIndex: -1,
  loading: false,
  error: null,
};

export const fetchLocationSuggestions = createAsyncThunk<
  string[],
  string,
  { rejectValue: string }
>(
  'search/fetchLocationSuggestions',
  async (input, { rejectWithValue }) => {
    try {
      if (input.length <= 1) return [];

      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      if (!apiKey) {
        throw new Error('Weather API key is missing');
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${apiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error('Invalid API key');
        } else if (response.status === 404) {
          throw new Error('Location not found');
        } else if (response.status === 429) {
          throw new Error('Too many requests, please try again later');
        } else {
          throw new Error(errorData.message || `Error ${response.status}: Failed to fetch suggestions`);
        }
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map((city: any) => `${city.name}, ${city.country}`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch suggestions');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSuggestions(state) {
      state.suggestions = [];
      state.highlightedIndex = -1;
    },
    setHighlightedIndex(state, action: PayloadAction<number>) {
      state.highlightedIndex = action.payload;
    },
    setSearchError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchLocationSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.suggestions = [];
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const {
  setQuery,
  clearSuggestions,
  setHighlightedIndex,
  setSearchError,
} = searchSlice.actions;

export default searchSlice.reducer;