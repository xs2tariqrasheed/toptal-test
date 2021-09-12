import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
};

export const fetchBikes = createAsyncThunk(
  "bikes/fetchBikes",
  async () => await fetchDocs("bikes")
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
} = bikesSlice.actions;

export const selectBikes = ({ bikes: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectBikesLoading = (state) => state.bikes.loading;
export const selectShouldShowNewlyAddedRowFeedback = (state) =>
  state.bikes.shouldShowNewlyAddedRowFeedback;
export const selectBikeToBeEdited = (state) =>
  state.bikes.data.find((item) => item.shouldEdit);

export default bikesSlice.reducer;
