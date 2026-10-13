import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { TickerProvider } from "./context/TickerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <TickerProvider>
            <App />
        </TickerProvider>
    </React.StrictMode>
);