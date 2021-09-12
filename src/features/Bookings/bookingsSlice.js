import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => await fetchDocs("bookings")
);

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setSearch: (state, { payload: { search } }) => {
      state.search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.map((item) => ({
          ...item,
          searchText: constructSearchText(item),
          shouldEdit: !!state.data.find(
            (prevItem) => prevItem.shouldEdit && prevItem.id === item.id
          ),
        }));
      });
  },
});

export const { setSearch } = bookingsSlice.actions;

export const selectBookings = ({ bookings: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectBookingsLoading = (state) => state.bookings.loading;

export default bookingsSlice.reducer;
