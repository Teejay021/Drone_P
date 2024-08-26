import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        username: null,
        image: null
    },
    reducers: {
        login: (state, action) => {
            console.log("changing the status to true for user logged in");
            console.log(action.payload.image);
            state.isLoggedIn = true;
            state.username = action.payload.username;
            state.image = action.payload.image;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.username = null;
            state.image = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
