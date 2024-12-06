import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Flex, Text, Button } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { RootState } from "../../store/store";
import { removeNotification } from "../../store/slices/notifications.slice";
import { green, red, blue, orange } from "@radix-ui/colors";

export enum NotificationType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

export const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notification
  );

  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 3000)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, dispatch]);

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <Box
      style={{
        position: "fixed",
        bottom: "5.5rem",
        right: "0.5rem",
        width: "350px",
        zIndex: 1000,
      }}
    >
      {notifications.map((notification) => (
        <Flex
          key={notification.id}
          style={{
            backgroundColor: getNotificationColor(notification.type),
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>{notification.message}</Text>
          <Button
            onClick={() => handleRemoveNotification(notification.id)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Cross2Icon color="white" />
          </Button>
        </Flex>
      ))}
    </Box>
  );
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return green.green9; // Green
    case NotificationType.Error:
      return red.red9; // Red
    case NotificationType.Info:
      return blue.blue9; // Blue
    case NotificationType.Warning:
      return orange.orange9; // Orange
    default:
      return green.green9;
  }
};
