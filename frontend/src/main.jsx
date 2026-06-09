import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";

import "./i18n";

const token = localStorage.getItem("token");

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    {
      token ? <App /> : <Login />
    }

  </React.StrictMode>

);