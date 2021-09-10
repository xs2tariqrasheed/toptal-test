import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import colors from "../features/colors/colorsSlice";

export const store = configureStore({
  reducer: {
    colors,
    counter: counterReducer,
  },
});
