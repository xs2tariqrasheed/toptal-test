import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
};

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async () => await fetchDocs("locations")
);

export const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocationToBeEdited: (state, { payload: { locationId } }) => {
      const index = state.data.findIndex((item) => item.id === locationId);
      state.data[index].shouldEdit = true;
    },
    unsetLocationToBeEdited: (state, { payload: { locationId } }) => {
      const index = state.data.findIndex((item) => item.id === locationId);
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
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
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
  setLocationToBeEdited,
  unsetLocationToBeEdited,
  setSearch,
  setShouldShowNewlyAddedRowFeedback,
} = locationsSlice.actions;

export const selectLocations = ({ locations: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectLocationsLoading = (state) => state.locations.loading;
export const SelectShouldShowNewlyAddedRowFeedback = (state) =>
  state.locations.shouldShowNewlyAddedRowFeedback;
export const selectLocationToBeEdited = (state) =>
  state.locations.data.find((item) => item.shouldEdit);

export default locationsSlice.reducer;
