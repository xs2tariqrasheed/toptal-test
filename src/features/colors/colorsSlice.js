import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDocs } from "../../firebase";

const initialState = {
  data: [],
  loading: false,
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
        state.loading = false;
        state.data = action.payload.map((item) => ({
          ...item,
          shouldEdit: !!state.data.find(
            (prevItem) => prevItem.shouldEdit && prevItem.id === item.id
          ),
        }));
      });
  },
});

export const { setColorToBeEdited, unsetColorToBeEdited } = colorSlice.actions;

export const selectColors = (state) => state.colors.data;
export const selectColorsLoading = (state) => state.colors.loading;
export const selectColorToBeEdited = (state) =>
  state.colors.data.find((item) => item.shouldEdit);

export default colorSlice.reducer;
