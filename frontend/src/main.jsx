// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { store, persistor } from "./Redux/store"; // Import both store and persistor

const clientId = '718921547648-htg9q59o6ka7j7jsp45cc4dai6olfqs5.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> // Uncomment if you want StrictMode
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);