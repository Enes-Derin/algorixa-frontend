import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

export const fetchActiveCampaign = createAsyncThunk(
    "campaign/fetchActive",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/pricing/campaign/active");
            return res.data.data;
        } catch {
            return null;
        }
    }
);

export const fetchAllCampaigns = createAsyncThunk(
    "campaign/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/campaigns");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanyalar getirilemedi");
        }
    }
);

export const createCampaign = createAsyncThunk(
    "campaign/admin/create",
    async (campaignData, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post("/api/admin/campaigns", campaignData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanya oluşturulamadı");
        }
    }
);

export const updateCampaign = createAsyncThunk(
    "campaign/admin/update",
    async ({ id, campaignData }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.put(`/api/admin/campaigns/${id}`, campaignData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanya güncellenemedi");
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    "campaign/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/api/admin/campaigns/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanya silinemedi");
        }
    }
);

export const activateCampaign = createAsyncThunk(
    "campaign/admin/activate",
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/campaigns/${id}/activate`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanya aktifleştirilemedi");
        }
    }
);

export const deactivateCampaign = createAsyncThunk(
    "campaign/admin/deactivate",
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/campaigns/${id}/deactivate`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kampanya deaktif edilemedi");
        }
    }
);

const campaignSlice = createSlice({
    name: "campaign",
    initialState: {
        activeCampaign: null,
        campaigns: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveCampaign.fulfilled, (state, action) => {
                state.activeCampaign = action.payload;
            })
            .addCase(fetchAllCampaigns.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllCampaigns.fulfilled, (state, action) => { state.campaigns = action.payload; state.loading = false; })
            .addCase(fetchAllCampaigns.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createCampaign.fulfilled, (state, action) => { state.campaigns.unshift(action.payload); })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                const index = state.campaigns.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.campaigns[index] = action.payload;
            })
            .addCase(deleteCampaign.fulfilled, (state, action) => {
                state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
            })
            .addCase(activateCampaign.fulfilled, (state, action) => {
                state.activeCampaign = action.payload;
                const index = state.campaigns.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.campaigns[index] = action.payload;
            })
            .addCase(deactivateCampaign.fulfilled, (state, action) => {
                if (state.activeCampaign?.id === action.payload.id) state.activeCampaign = null;
                const index = state.campaigns.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.campaigns[index] = action.payload;
            });
    }
});

export const { clearError } = campaignSlice.actions;
export default campaignSlice.reducer;