import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    role: localStorage.getItem("role") || null,
    tokenExpiry: localStorage.getItem("tokenExpiry") || null,
    isAuthenticated: !!localStorage.getItem("accessToken")
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Backend'den login response'ı
        loginSuccess: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.role = action.payload.role;
            state.isAuthenticated = true;

            // localStorage'a kaydet
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
            localStorage.setItem("role", action.payload.role);
            
            // Token expiry'ı ayarla (15 dakika sonra)
            const expiryTime = new Date().getTime() + (15 * 60 * 1000);
            localStorage.setItem("tokenExpiry", expiryTime);
            state.tokenExpiry = expiryTime;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
            
            // Token expiry'ı güncelle (15 dakika sonra)
            const expiryTime = new Date().getTime() + (15 * 60 * 1000);
            localStorage.setItem("tokenExpiry", expiryTime);
            state.tokenExpiry = expiryTime;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.role = null;
            state.tokenExpiry = null;
            state.isAuthenticated = false;

            // localStorage'dan temizle
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("role");
            localStorage.removeItem("tokenExpiry");
        },
        clearExpiredToken: (state) => {
            state.accessToken = null;
            state.tokenExpiry = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenExpiry");
        }
    }
});

export const {
    loginSuccess,
    setAccessToken,
    logout,
    clearExpiredToken
} = authSlice.actions;

export default authSlice.reducer;
