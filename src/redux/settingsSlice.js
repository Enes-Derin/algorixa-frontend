// redux/settingsSlice.js - ✅ URL ENCODING İLE
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// GET - Tek bir ayar
export const fetchSetting = createAsyncThunk(
    "settings/fetchOne",
    async (key, { rejectWithValue }) => {
        try {
            // ✅ Key'i URL encode et
            const encodedKey = encodeURIComponent(key);
            const res = await apiInstance.get(`/api/admin/settings/${encodedKey}`);

            return {
                key: res.data.data.settingKey,
                value: res.data.data.settingValue
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Ayar getirilemedi");
        }
    }
);

// GET - Birden fazla ayar (toplu)
export const fetchSettings = createAsyncThunk(
    "settings/fetchMultiple",
    async (keys, { rejectWithValue }) => {
        try {
            const promises = keys.map(key => {
                // ✅ Her key'i URL encode et
                const encodedKey = encodeURIComponent(key);
                return apiInstance.get(`/api/admin/settings/${encodedKey}`)
                    .then(res => ({
                        key: res.data.data.settingKey,
                        value: res.data.data.settingValue
                    }))
                    .catch(() => ({ key, value: null }));
            });
            const results = await Promise.all(promises);

            return results.reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {});
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Ayarlar getirilemedi");
        }
    }
);

// PUT - Ayar güncelle
export const updateSetting = createAsyncThunk(
    "settings/update",
    async ({ key, value }, { rejectWithValue }) => {
        try {
            // ✅ Key'i URL encode et
            const encodedKey = encodeURIComponent(key);
            const res = await apiInstance.put(`/api/admin/settings/${encodedKey}`, {
                settingKey: key,
                settingValue: value,
                settingType: "TEXT",
                description: null
            });

            return {
                key: res.data.data.settingKey,
                value: res.data.data.settingValue
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Ayar güncellenemedi");
        }
    }
);

// DELETE - Ayar sil
export const deleteSetting = createAsyncThunk(
    "settings/delete",
    async (key, { rejectWithValue }) => {
        try {
            // ✅ Key'i URL encode et
            const encodedKey = encodeURIComponent(key);
            await apiInstance.delete(`/api/admin/settings/${encodedKey}`);
            return key;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Ayar silinemedi");
        }
    }
);

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        settings: {},
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSetting.fulfilled, (state, action) => {
                state.settings[action.payload.key] = action.payload.value;
            })
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.settings = { ...state.settings, ...action.payload };
                state.loading = false;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSetting.fulfilled, (state, action) => {
                state.settings[action.payload.key] = action.payload.value;
            })
            .addCase(deleteSetting.fulfilled, (state, action) => {
                delete state.settings[action.payload];
            });
    }
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
