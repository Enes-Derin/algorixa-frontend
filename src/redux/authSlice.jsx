import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";
import { setTokens, clearTokens, getAccessToken } from "../utils/tokenService";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post("/auth/login", credentials);
            const { accessToken, refreshToken, role } = res.data.data;
            setTokens(accessToken, refreshToken);
            return { accessToken, role };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    clearTokens();
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: getAccessToken() || null, // localStorage'dan yükle
        user: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload.accessToken;
                state.user = { role: action.payload.role };
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
            });
    }
});

export default authSlice.reducer;
