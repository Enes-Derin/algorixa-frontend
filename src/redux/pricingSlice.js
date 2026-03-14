import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

export const fetchActivePackages = createAsyncThunk(
    "pricing/fetchActive",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/pricing/packages");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paketler getirilemedi");
        }
    }
);

export const fetchPackageByCode = createAsyncThunk(
    "pricing/fetchByCode",
    async (code, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/public/pricing/packages/${code}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paket bulunamadı");
        }
    }
);

export const fetchActiveCampaign = createAsyncThunk(
    "pricing/fetchActiveCampaign",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/pricing/campaign/active");
            return res.data.data;
        } catch {
            return null;
        }
    }
);

export const fetchAllPackages = createAsyncThunk(
    "pricing/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/pricing/packages");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paketler getirilemedi");
        }
    }
);

export const createPackage = createAsyncThunk(
    "pricing/admin/create",
    async (packageData, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post("/api/admin/pricing/packages", packageData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paket oluşturulamadı");
        }
    }
);

export const updatePackage = createAsyncThunk(
    "pricing/admin/update",
    async ({ id, packageData }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.put(`/api/admin/pricing/packages/${id}`, packageData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paket güncellenemedi");
        }
    }
);

export const deletePackage = createAsyncThunk(
    "pricing/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/api/admin/pricing/packages/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Paket silinemedi");
        }
    }
);

export const updatePackageDisplayOrder = createAsyncThunk(
    "pricing/admin/updateOrder",
    async ({ id, order }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/pricing/packages/${id}/order?order=${order}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Sıra güncellenemedi");
        }
    }
);

const pricingSlice = createSlice({
    name: "pricing",
    initialState: {
        packages: [],
        activeCampaign: null,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivePackages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchActivePackages.fulfilled, (state, action) => { state.packages = action.payload; state.loading = false; })
            .addCase(fetchActivePackages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAllPackages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllPackages.fulfilled, (state, action) => { state.packages = action.payload; state.loading = false; })
            .addCase(fetchAllPackages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchActiveCampaign.fulfilled, (state, action) => { state.activeCampaign = action.payload; })
            .addCase(createPackage.fulfilled, (state, action) => { state.packages.push(action.payload); })
            .addCase(updatePackage.fulfilled, (state, action) => {
                const index = state.packages.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.packages[index] = action.payload;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.packages = state.packages.filter(p => p.id !== action.payload);
            })
            .addCase(updatePackageDisplayOrder.fulfilled, (state, action) => {
                const index = state.packages.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.packages[index] = action.payload;
            });
    }
});

export const { clearError } = pricingSlice.actions;
export default pricingSlice.reducer;