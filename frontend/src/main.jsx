// src/main.jsx or src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import store from "./Redux/store"; // Import your Redux store

const clientId = '718921547648-htg9q59o6ka7j7jsp45cc4dai6olfqs5.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById("root")).render(
 // <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
 // </React.StrictMode>
);
