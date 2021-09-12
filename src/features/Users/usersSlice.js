import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDocs } from "../../firebase";
import { constructSearchText } from "../../utils/constructSearchText";

const initialState = {
  data: [],
  loading: false,
  search: "",
  shouldShowNewlyAddedRowFeedback: false,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => await fetchDocs("profiles")
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserToBeEdited: (state, { payload: { userId } }) => {
      const index = state.data.findIndex((item) => item.id === userId);
      state.data[index].shouldEdit = true;
    },
    unsetUserToBeEdited: (state, { payload: { userId } }) => {
      const index = state.data.findIndex((item) => item.id === userId);
      if (index >= 0) state.data[index].shouldEdit = false;
    },
    setUserToGetBikes: (state, { payload: { userId } }) => {
      const index = state.data.findIndex((item) => item.userId === userId);
      state.data[index].shouldGetBikes = true;
    },
    unsetUserToGetBikes: (state, { payload: { userId } }) => {
      const index = state.data.findIndex((item) => item.userId === userId);
      if (index >= 0) state.data[index].shouldGetBikes = false;
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
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
  setUserToBeEdited,
  unsetUserToBeEdited,
  setSearch,
  setShouldShowNewlyAddedRowFeedback,
  setUserToGetBikes,
  unsetUserToGetBikes,
} = usersSlice.actions;

export const selectUsers = ({ users: { data, search } }) =>
  search
    ? data.filter((item) =>
        item.searchText.includes(search.trim().toLowerCase())
      )
    : data;
export const selectUsersLoading = (state) => state.users.loading;
export const SelectShouldShowNewlyAddedRowFeedback = (state) =>
  state.users.shouldShowNewlyAddedRowFeedback;
export const selectUserToBeEdited = (state) =>
  state.users.data.find((item) => item.shouldEdit);
export const selectUserToGetBikes = (state) =>
  state.users.data.find((item) => item.shouldGetBikes);

export default usersSlice.reducer;
