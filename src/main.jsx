import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { UserProvider } from "@/API/currentUserContext";
import { store } from "@/store";
import App from "./App";
import "./index.css";

// Providers: Redux store → current Domo user.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  </StrictMode>
);
