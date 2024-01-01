import {createSlice} from "@reduxjs/toolkit";


const nightToggleSlice = createSlice({

    name: "nightToggle",
    initialState : false,
    reducers:{

        nightMode(state){

            console.log("changing the night mode");

            return !state;
        }
    }
});

export const {nightMode} = nightToggleSlice.actions;

export const nightToggleReducer = nightToggleSlice.reducer;