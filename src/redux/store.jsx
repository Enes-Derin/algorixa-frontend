import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import contactReducer from "./contactSlice";
import projectReducer from "./projectSlice";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contact: contactReducer,
        project: projectReducer,
        dashboard: dashboardReducer
    }
});
