import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/dashboard/stats");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "İstatistikler getirilemedi");
        }
    }
);

export const fetchRecentActivity = createAsyncThunk(
    "dashboard/fetchActivity",
    async (limit = 20, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/admin/dashboard/activity/recent?limit=${limit}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Aktiviteler getirilemedi");
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        stats: {
            totalBlogPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalProjects: 0,
            publishedProjects: 0,
            featuredProjects: 0,
            newContactSubmissions: 0,
            unreadContacts: 0,
            activeCampaigns: 0,
            recentActivity: [],
            popularBlogPosts: []
        },
        recentActivity: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.stats = action.payload;
                state.loading = false;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchRecentActivity.fulfilled, (state, action) => {
                state.recentActivity = action.payload;
            });
    }
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;