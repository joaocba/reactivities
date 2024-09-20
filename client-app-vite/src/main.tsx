import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "semantic-ui-css/semantic.min.css"; // Import Semantic UI
import "react-calendar/dist/Calendar.css"; // Import React Calendar
import "react-toastify/dist/ReactToastify.min.css"; // Import React Toastify
import "react-datepicker/dist/react-datepicker.css"; // Import React Datepicker
import "./app/layout/styles.css";
import { store, StoreContext } from "./app/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <RouterProvider router={router} />
        </StoreContext.Provider>
    </StrictMode>
);
