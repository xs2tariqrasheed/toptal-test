import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
};

export const fetchColors = createAsyncThunk(
  "colors/fetchColors",
  async () => await fetchDocs("colors")
);

export const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {
    setColorToBeEdited: (state, { payload: { colorId } }) => {
      const index = state.data.findIndex((item) => item.id === colorId);
      state.data[index].shouldEdit = true;
    },
    unsetColorToBeEdited: (state, { payload: { colorId } }) => {
      const index = state.data.findIndex((item) => item.id === colorId);
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
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchColors.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
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
  setColorToBeEdited,
  unsetColorToBeEdited,
  setSearch,
  setShouldShowNewlyAddedRowFeedback,
} = colorSlice.actions;

export const selectColors = ({ colors: { data, search } }) =>
  search ? data.filter((item) => item.searchText.includes(search)) : data;
export const selectColorsLoading = (state) => state.colors.loading;
export const SelectShouldShowNewlyAddedRowFeedback = (state) =>
  state.colors.shouldShowNewlyAddedRowFeedback;
export const selectColorToBeEdited = (state) =>
  state.colors.data.find((item) => item.shouldEdit);

export default colorSlice.reducer;
