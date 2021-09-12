import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
};

export const fetchModels = createAsyncThunk(
  "models/fetchModels",
  async () => await fetchDocs("models")
);

export const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    setModelToBeEdited: (state, { payload: { modelId } }) => {
      const index = state.data.findIndex((item) => item.id === modelId);
      state.data[index].shouldEdit = true;
    },
    unsetModelToBeEdited: (state, { payload: { modelId } }) => {
      const index = state.data.findIndex((item) => item.id === modelId);
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
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModels.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
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
  setModelToBeEdited,
  unsetModelToBeEdited,
  setSearch,
  setShouldShowNewlyAddedRowFeedback,
} = modelsSlice.actions;

export const selectModels = ({ models: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectModelsLoading = (state) => state.models.loading;
export const selectShouldShowNewlyAddedRowFeedback = (state) =>
  state.models.shouldShowNewlyAddedRowFeedback;
export const selectModelToBeEdited = (state) =>
  state.models.data.find((item) => item.shouldEdit);

export default modelsSlice.reducer;
