import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Notification } from "./components/common/notification";
import { Provider } from "react-redux";
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="mint" scaling="100%" radius="full">
      <Provider store={store}>
        <Notification />
        <App />
      </Provider>
    </Theme>
  </React.StrictMode>
);
