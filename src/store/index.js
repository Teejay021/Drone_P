import { configureStore } from "@reduxjs/toolkit";
import { nightMode, nightToggleReducer } from "./slices/nightToggleSlice";
import { login, logout, userSliceReducer } from "./slices/userSlice";
import { setKeybinds, keybindSliceReducer } from "./slices/keybindSlice";
import { keybindApi } from "./apis/keybindApi";

const store = configureStore({
    reducer: {
        nightToggle: nightToggleReducer,
        user: userSliceReducer,
        keybind: keybindSliceReducer,
        [keybindApi.reducerPath]: keybindApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(keybindApi.middleware),

});

export * from "./thunks/fetchKeybinds";
export * from "./apis/keybindApi";
export { store, nightMode, login, logout };
export { setKeybinds };
