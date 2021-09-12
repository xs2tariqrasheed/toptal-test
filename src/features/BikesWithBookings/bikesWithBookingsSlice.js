import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
};

export const fetchBikes = createAsyncThunk(
  "bikesWithBookings/fetchBikes",
  async () => await fetchDocs("bikes")
);

export const bikesWithBookingsSlice = createSlice({
  name: "bikesWithBookings",
  initialState,
  reducers: {
    setSearch: (state, { payload: { search } }) => {
      state.search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBikes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
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

export const {
  setBikeToBeEdited,
  unsetBikeToBeEdited,
  setSearch,
  setShouldShowNewlyAddedRowFeedback,
  setBikeToBeBooked,
  unsetBikeToBeBooked,
} = bikesWithBookingsSlice.actions;

export const selectBikes = ({ bikesWithBookings: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectBikesLoading = (state) => state.bikesWithBookings.loading;

export default bikesWithBookingsSlice.reducer;
