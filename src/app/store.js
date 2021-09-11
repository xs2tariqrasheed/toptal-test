import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import app from "../features/App/appSlice";
import locations from "../features/Locations/locationsSlice";
import colors from "../features/Colors/colorsSlice";

export const store = configureStore({
  reducer: {
    app,
    colors,
    locations,
    counter: counterReducer,
  },
});
