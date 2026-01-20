import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// DASHBOARD İSTATİSTİKLERİ
export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async () => {
        const res = await apiInstance.get("/dashboard/stats");
        return res.data.data;
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        totalVisits: 0,
        messageCount: 0,
        projectCount: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.totalVisits = action.payload.totalVisits || 0;
                state.messageCount = action.payload.messageCount || 0;
                state.projectCount = action.payload.projectCount || 0;
                state.loading = false;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default dashboardSlice.reducer;
