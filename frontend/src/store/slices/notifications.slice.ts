import { createSlice } from "@reduxjs/toolkit";
import { NotificationType } from "../../components/common/notification";

const initialState = {
  server: "localhost",
  id: undefined,
  notification: [] as Array<{
    id: string;
    message: string;
    type: NotificationType;
  }>,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notification.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notification = state.notification.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
