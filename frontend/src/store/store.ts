import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import notificationsReducer from "./slices/notifications.slice";

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
