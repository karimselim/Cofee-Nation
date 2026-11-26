import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/dark.css";
import { applyTheme, getStoredTheme } from "./components/ThemeToggle";
import { initLang } from "./i18n";
import App from "./App";
import { Provider } from "react-redux";
import store from "./setup";
import UserSync from "./components/UserSync";
import { UserAuthContextProvider } from "./setup/context/user-auth-context";

applyTheme(getStoredTheme());
initLang();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <UserAuthContextProvider>
        <UserSync />
        <App />
      </UserAuthContextProvider>
    </React.StrictMode>
  </Provider>
);


