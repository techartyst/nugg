import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style/index.css";
import "./style/notebook.css";
import "./style/profile.css";

import { Provider } from "react-redux";
import store from "./app/store.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
