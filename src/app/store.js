import { configureStore } from "@reduxjs/toolkit";

import app from "../features/App/appSlice";
import users from "../features/Users/usersSlice";
import bikes from "../features/Bikes/bikesSlice";
import bikesWithBookings from "../features/BikesWithBookings/bikesWithBookingsSlice";
import colors from "../features/Colors/colorsSlice";
import models from "../features/Models/modelsSlice";
import locations from "../features/Locations/locationsSlice";
import bookings from "../features/Bookings/bookingsSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    app,
    users,
    bikes,
    colors,
    models,
    bookings,
    locations,
    bikesWithBookings,
    counter: counterReducer,
  },
});
