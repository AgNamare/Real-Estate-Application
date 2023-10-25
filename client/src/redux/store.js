import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer:{user: userReducer},
  // Disable serializability check for Redux state updates.
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck:false
  }),
});