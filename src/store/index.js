import { configureStore } from "@reduxjs/toolkit";
import { nightMode, nightToggleReducer } from "./slices/nightToggleSlice";
import { login, logout, userSliceReducer } from "./slices/userSlice";
import { setKeybinds, keybindSliceReducer } from "./slices/keybindSlice";

const store = configureStore({
    reducer: {
        nightToggle: nightToggleReducer,
        user: userSliceReducer,
        keybind: keybindSliceReducer,
    },
});

export * from "./thunks/fetchKeybinds";
export { store, nightMode, login, logout };
export { setKeybinds };
