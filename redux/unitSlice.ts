import { createSlice } from '@reduxjs/toolkit';

export const unitSlice = createSlice({
    name: 'unit',
    initialState: {
      temperatureUnit: 'celsius'
    },
    reducers: {
      toggleTemperatureUnit: (state) => {
        state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      }
    }
});
  
export const { toggleTemperatureUnit } = unitSlice.actions;
export default unitSlice.reducer;