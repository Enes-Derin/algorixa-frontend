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
            const username = credentials.username;
            localStorage.setItem("user", JSON.stringify({ role, username }));
            return { accessToken, role, username };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.errorMessage ||
                err.response?.data?.message ||
                "Kullanıcı adı veya şifre hatalı"
            );
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    clearTokens();
    localStorage.removeItem("user");
});

const loadInitialState = () => {
    const token = getAccessToken();
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            return { token, user, status: "idle", error: null };
        } catch {
            clearTokens();
            localStorage.removeItem("user");
        }
    }
    return { token: null, user: null, status: "idle", error: null };
};

const authSlice = createSlice({
    name: "auth",
    initialState: loadInitialState(),
    reducers: {
        clearError: (state) => { state.error = null; },
        updateToken: (state, action) => { state.token = action.payload; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload.accessToken;
                state.user = {
                    role: action.payload.role,
                    username: action.payload.username
                };
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.token = null;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.status = "idle";
                state.error = null;
            });
    }
});

export const { clearError, updateToken } = authSlice.actions;
export default authSlice.reducer;