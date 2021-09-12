import { configureStore } from "@reduxjs/toolkit";

import app from "../features/App/appSlice";
import colors from "../features/Colors/colorsSlice";
import models from "../features/Models/modelsSlice";
import locations from "../features/Locations/locationsSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    app,
    colors,
    models,
    locations,
    counter: counterReducer,
  },
});
