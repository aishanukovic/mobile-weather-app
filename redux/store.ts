import { configureStore } from '@reduxjs/toolkit';
import forecastReducer from './forecastSlice';
import searchReducer from './searchSlice';
import unitReducer from './unitSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    forecast: forecastReducer,
    unit: unitReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;