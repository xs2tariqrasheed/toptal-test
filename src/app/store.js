import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import app from "../features/App/appSlice";
import colors from "../features/Colors/colorsSlice";

export const store = configureStore({
  reducer: {
    app,
    colors,
    counter: counterReducer,
  },
});
