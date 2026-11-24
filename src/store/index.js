import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import foodieReducer from "./foodieSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    foodie: foodieReducer,
  },
});
