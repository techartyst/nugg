import { configureStore } from "@reduxjs/toolkit";
import nuroSlice from "../feature/nuroSlice";

const store = configureStore({
  reducer: {
    nuggetKey: nuroSlice,
  },
});

export default store;