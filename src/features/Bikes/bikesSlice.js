import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
  ratings: [],
  ratingLoading: [],
};

export const fetchBikes = createAsyncThunk(
  "bikes/fetchBikes",
  async () => await fetchDocs("bikes")
);

export const fetchRatings = createAsyncThunk(
  "bikes/fetchRatings",
  async () => await fetchDocs("ratings")
);

export const bikesSlice = createSlice({
  name: "bikes",
  initialState,
  reducers: {
    setBikeToBeEdited: (state, { payload: { bikeId } }) => {
      const index = state.data.findIndex((item) => item.id === bikeId);
      state.data[index].shouldEdit = true;
    },
    unsetBikeToBeEdited: (state, { payload: { bikeId } }) => {
      const index = state.data.findIndex((item) => item.id === bikeId);
      if (index >= 0) state.data[index].shouldEdit = false;
    },
    setSearch: (state, { payload: { search } }) => {
      state.search = search;
    },
    setBikeToBeBooked: (state, { payload: { bikeId } }) => {
      const index = state.data.findIndex((item) => item.id === bikeId);
      state.data[index].shouldBook = true;
    },
    unsetBikeToBeBooked: (state, { payload: { bikeId } }) => {
      const index = state.data.findIndex((item) => item.id === bikeId);
      if (index >= 0) state.data[index].shouldBook = false;
    },
    setShouldShowNewlyAddedRowFeedback: (state, { payload: { value } }) => {
      state.shouldShowNewlyAddedRowFeedback = value;
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
        if (state.data.length) {
          if (state.data.length < action.payload.length) {
            state.shouldShowNewlyAddedRowFeedback = true;
          }
        }
        state.loading = false;
        state.data = action.payload.map((item) => ({
          ...item,
          shouldEdit: !!state.data.find(
            (prevItem) => prevItem.shouldEdit && prevItem.id === item.id
          ),
        }));
      })
      .addCase(fetchRatings.pending, (state) => {
        state.ratingLoading = true;
      })
      .addCase(fetchRatings.rejected, (state) => {
        state.ratingLoading = false;
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratingLoading = false;
        state.ratings = action.payload;
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
} = bikesSlice.actions;

export const selectBikes = ({ bikes: { data, search } }) =>
  search
    ? data.filter((item) =>
        constructSearchText(item).includes(search.trim().toLowerCase())
      )
    : data;
export const selectBikesLoading = (state) => state.bikes.loading;
export const selectRatingLoading = (state) => state.bikes.ratingLoading;
export const selectRatings = (state) => state.bikes.ratings;
export const selectShouldShowNewlyAddedRowFeedback = (state) =>
  state.bikes.shouldShowNewlyAddedRowFeedback;
export const selectBikeToBeEdited = (state) =>
  state.bikes.data.find((item) => item.shouldEdit);
export const selectBikeToBeBooked = (state) =>
  state.bikes.data.find((item) => item.shouldBook);

export default bikesSlice.reducer;
