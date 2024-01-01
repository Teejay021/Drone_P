import { createSlice } from "@reduxjs/toolkit";

const keybindSlice = createSlice({

    name:"keybind",
    initialState:{

        leftMotorForward: "w",
        leftMotorBackward:"s",

        rightMotorForward: "i",
        rightMotorBackward:"k"
    },
    reducers:{

        setKeybinds: (state, action) => {
            return { ...state, ...action.payload };
        },




    }
});

export const {setKeybinds} = keybindSlice.actions;

export const keybindSliceReducer = keybindSlice.reducer;