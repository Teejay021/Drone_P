import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({

    name:"user",
    initialState:{
        isLoggedIn: false,
        username: null,
    },
    reducers:{

        login: (state, action) => {
            state.isLoggedIn = true;
            state.username  = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.username = null;
        },



    }
});

export const {login, logout} = userSlice.actions;

export const userSliceReducer = userSlice.reducer;