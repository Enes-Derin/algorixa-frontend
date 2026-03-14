import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import contactReducer from "./contactSlice";
import portfolioReducer from "./portfolioSlice";
import dashboardReducer from "./dashboardSlice";
import blogReducer from "./blogSlice";
import pricingReducer from "./pricingSlice";
import campaignReducer from "./campaignSlice";
import maintenanceReducer from "./maintenanceSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contact: contactReducer,
        portfolio: portfolioReducer,
        dashboard: dashboardReducer,
        blog: blogReducer,
        pricing: pricingReducer,
        campaign: campaignReducer,
        maintenance: maintenanceReducer
    }
});