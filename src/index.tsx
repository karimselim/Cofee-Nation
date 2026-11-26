import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./setup";
import { UserAuthContextProvider } from "./setup/context/user-auth-context";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <UserAuthContextProvider>
        <App />
      </UserAuthContextProvider>
    </React.StrictMode>
  </Provider>
);


