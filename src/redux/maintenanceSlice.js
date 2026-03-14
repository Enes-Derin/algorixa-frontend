// redux/maintenanceSlice.js - ✅ fetchPublicPlans ALIAS
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// ✅ PUBLIC - Aktif bakım planları
export const fetchPublicPlans = createAsyncThunk(
    "maintenance/fetchPublic",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/pricing/maintenance");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Planlar getirilemedi");
        }
    }
);

// Backward compatibility
export const fetchActivePlans = fetchPublicPlans;

// PUBLIC - Kod ile plan getir
export const fetchPlanByCode = createAsyncThunk(
    "maintenance/fetchByCode",
    async (code, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/public/pricing/maintenance/${code}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Plan bulunamadı");
        }
    }
);

// ADMIN - Tüm planlar
export const fetchAllPlans = createAsyncThunk(
    "maintenance/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/pricing/maintenance");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Planlar getirilemedi");
        }
    }
);

// ADMIN - Plan oluştur
export const createPlan = createAsyncThunk(
    "maintenance/admin/create",
    async (planData, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post("/api/admin/pricing/maintenance", planData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Plan oluşturulamadı");
        }
    }
);

// ADMIN - Plan güncelle
export const updatePlan = createAsyncThunk(
    "maintenance/admin/update",
    async ({ id, planData }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.put(`/api/admin/pricing/maintenance/${id}`, planData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Plan güncellenemedi");
        }
    }
);

// ADMIN - Plan sil
export const deletePlan = createAsyncThunk(
    "maintenance/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/api/admin/pricing/maintenance/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Plan silinemedi");
        }
    }
);

const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState: {
        plans: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicPlans.fulfilled, (state, action) => {
                state.plans = action.payload;
                state.loading = false;
            })
            .addCase(fetchPublicPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllPlans.fulfilled, (state, action) => {
                state.plans = action.payload;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.plans.push(action.payload);
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                const index = state.plans.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.plans[index] = action.payload;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.plans = state.plans.filter(p => p.id !== action.payload);
            });
    }
});

export const { clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;